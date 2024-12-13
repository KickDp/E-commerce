import React, { useState } from "react";
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct =()=>{
    const [image,setImage] = useState(false);
    const [productdetails,setProductdetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imageHandler = (e)=>{
        setImage(e.target.files[0]);
    }
    const changehandler=(e)=>{
        setProductdetails({...productdetails,[e.target.name]:e.target.value})
    }
    
    const Add_product = async ()=>{
        console.log(productdetails);
        let responseData;
        let product = productdetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('https://e-commerce-backend-tgse.onrender.com/upload',{
            method:'POST',
            header:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});
    

    if(responseData.success){
        product.image = responseData.imageUrl;
        console.log(product);
        await fetch('https://e-commerce-backend-tgse.onrender.com/addproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(product),
        }).then((resp)=>resp.json()).then((data)=>{
            data.success?alert("Product Added"):alert("Failed")
        })
    }
}

    return (
        <div className="add-product">
          <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productdetails.name} onChange={changehandler} type="text" name='name' placeholder="type here" />
          </div>
          <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productdetails.old_price} onChange={changehandler} type="text" name='old_price' placeholder="Type here"/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productdetails.new_price} onChange={changehandler} type="text" name='new_price' placeholder="Type here"/>
            </div>
          </div>
            <div className="addproduct-itemfield">
                <p>Product category</p>
               <select value={productdetails.category} onChange={changehandler} name='category' className="add-product-selector">
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
               </select>
            </div>
            <div className="addproduct-itemfield">
               <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
               </label>
               <input onChange={imageHandler} type="file" name="image" id='file-input' hidden />
            </div>
            <button onClick={()=>{Add_product()}} className="addproduct-btn">ADD</button>
        </div>
    )
}
export default AddProduct
