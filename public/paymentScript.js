document.addEventListener('DOMContentLoaded', function () {
    // Set your Stripe public key
    const stripe = Stripe('your_stripe_public_key');
    const elements = stripe.elements();

    // Create an instance of the card Element.
    const card = elements.create('card');

    // Add an instance of the card Element into the `card-element` div.
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function (event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Handle form submission.
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        stripe.createToken(card).then(function (result) {
            if (result.error) {
                // Inform the user if there was an error.
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to your server.
                stripeTokenHandler(result.token);
            }
        });
    });

    // Submit the form with the token ID.
    function stripeTokenHandler(token) {
        // You can send the token to your server here.
        console.log(token);
        // Simulate sending the token to the server
        // Replace this with your server-side code to handle the payment
        fetch('/charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token.id,
                amount: 1000, // Replace with the actual amount in cents
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Payment successful!');
            console.log(data);
        })
        .catch(error => {
            alert('Payment failed. Please try again.');
            console.error('Error:', error);
        });
    }
});
