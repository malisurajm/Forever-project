import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";  

// 👉 Function for adding product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } =
      req.body;

    // Safely extract files
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]
   

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
     
    // Upload to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
   
      

    // Save to database (⚡ fixed field name: image)
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes), 
      bestseller: bestseller === "true" ? true : false,
      image: imageUrls,   // 👈 match your schema field
      date: Date.now()
    };

      console.log(productData);

      const product = new productModel(productData);
       await product.save();

    res.json({ success: true, message: "Product added successfully", product: productData });
  } catch (error) {
    console.error("Error adding product:", error);
    res.json({ success: false, message: error.message });
  }
};

// 👉 Function for listing all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
      console.log(error);
      
    res.json({ success: false, message: error.message });
  }
};

// 👉 Function for removing product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    
    res.json({ success: false, message: error.message });
  }
};

// 👉 Function for getting single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export { listProduct, addProduct, removeProduct, singleProduct };
