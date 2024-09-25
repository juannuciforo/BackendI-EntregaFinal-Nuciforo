document.addEventListener("DOMContentLoaded", () => {
	const quantityInputs = document.querySelectorAll(".quantity-input");
	const removeButtons = document.querySelectorAll(".remove-from-cart");
	const clearCartButton = document.querySelector(".clear-cart");

	quantityInputs.forEach((input) => {
		input.addEventListener("change", async () => {
			const productId = input.dataset.id;
			const newQuantity = input.value;
			try {
				const response = await fetch(`/api/carts/my-cart/products/${productId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ quantity: newQuantity }),
				});

				if (response.ok) {
					location.reload();
				} else {
					const errorData = await response.json();
					alert("Error: " + errorData.message);
				}
			} catch (error) {
				alert("Error al actualizar la cantidad");
			}
		});
	});

	removeButtons.forEach((button) => {
		button.addEventListener("click", async () => {
			const productId = button.dataset.id;
			try {
				const response = await fetch(`/api/carts/my-cart/products/${productId}`, {
					method: "DELETE",
				});

				if (response.ok) {
					location.reload();
				} else {
					const errorData = await response.json();
					alert("Error: " + errorData.message);
				}
			} catch (error) {
				alert("Error al eliminar el producto del carrito");
			}
		});
	});

	clearCartButton.addEventListener("click", async () => {
		try {
			const response = await fetch("/api/carts/my-cart", {
				method: "DELETE",
			});

			if (response.ok) {
				location.reload();
			} else {
				const errorData = await response.json();
				alert("Error: " + errorData.message);
			}
		} catch (error) {
			alert("Error al vaciar el carrito");
		}
	});
});
