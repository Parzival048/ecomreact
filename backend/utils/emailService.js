const nodemailer = require('nodemailer');

// Create transporter
let transporter;

// Check if email credentials are available
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Create a test account for development
  console.log('Email credentials not found. Email functionality will be simulated.');

  // Create a preview transporter that logs instead of sending
  transporter = {
    sendMail: (mailOptions) => {
      console.log('Email would be sent with the following options:');
      console.log(mailOptions);
      return Promise.resolve({ messageId: 'test-message-id' });
    }
  };
}

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    // Generate order items HTML
    let itemsHtml = '';
    order.orderItems.forEach((item) => {
      itemsHtml += `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.qty * item.price).toFixed(2)}</td>
        </tr>
      `;
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `Order Confirmation #${order._id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been confirmed and is being processed.</p>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>

        <h3>Items</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          ${itemsHtml}
        </table>

        <h3>Summary</h3>
        <p><strong>Items:</strong> $${order.itemsPrice}</p>
        <p><strong>Shipping:</strong> $${order.shippingPrice}</p>
        <p><strong>Tax:</strong> $${order.taxPrice}</p>
        <p><strong>Total:</strong> $${order.totalPrice}</p>

        <h3>Shipping Address</h3>
        <p>
          ${order.shippingAddress.address},<br>
          ${order.shippingAddress.city},<br>
          ${order.shippingAddress.postalCode},<br>
          ${order.shippingAddress.country}
        </p>

        <p>Thank you for shopping with us!</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent for order ${order._id}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

module.exports = { sendOrderConfirmationEmail };
