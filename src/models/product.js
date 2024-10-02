import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		code: { type: String, required: true, unique: true },
		price: { type: Number, required: true },
		status: { type: Boolean, default: true },
		stock: { type: Number, required: true },
		category: { type: String, required: true },
		thumbnails: { type: [String], default: [] },
	},
	{ timestamps: true }
);

productSchema.pre('save', async function (next) {
	if (this.isNew || this.isModified('code')) {
		const existingProduct = await this.constructor.findOne({ code: this.code });
		if (existingProduct) {
			return next(new Error('El código del producto ya existe'));
		}
	}
	next();
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
