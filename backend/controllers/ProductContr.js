import Product from "../models/ProductModel.js";
import path from 'path';
import fs from 'fs';

export const getProduct = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProduct = (req, res) => {

    // validasi terlebih dahulu terdapat FILE IMAGE pada form upload
    if (req.files === null) return res.status(400).json({ msg: "No file uploaded !" })

    const name = req.body.title;            // attribute untuk menerima nama file dari klien
    const file = req.files.file;            // attribute untuk menerima file dari klien
    const fileSize = file.data.length;      // attribute untuk menerima size file dari klien
    const ext = path.extname(file.name);    // attribute untuk menerima ext file dari klien
    const fileName = file.md5 + ext;        // attribute untuk convert nama + extensi file dari klien menjadi md5    

    // attribute membuat url untuk disimpan didatabase
    // protocol = berisi http / htpps
    // host = berisi localhost, jika online berisi domain
    // images = folder public
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    const allowedType = ['.png','.jpg','.jpeg'];     // attribute untuk ext file yg dapat diupload

    // validasi extensi yg dapat diupload
    if (!allowedType.includes(ext.toLowerCase())) 
    return res.status(420).json({ msg: "Invalid image !" });

    // validasi size file yg dapat diupload
    if(fileSize > 5000000) 
    return res.status(422).json({msg: "Image must be less than 5 MB"});

    // menyimpan file yg dapat diupload
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});

        try {
            await Product.create({name: name, image: fileName, url: url});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "Product Not Found"});

    let fileName = "";
    if(req.files === null) {
        fileName = Product.image;
    }else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
        
        if (!allowedType.includes(ext.toLowerCase())) 
        return res.status(420).json({ msg: "Invalid image !" });
        
        if(fileSize > 5000000) 
        return res.status(422).json({msg: "Image must be less than 5 MB"});

        // menghapus image pada folder public
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        // menyimpan image baru yg diupload
    file.mv(`./public/images/${fileName}`, (err)=>{
        if(err) return res.status(500).json({msg: err.message});

    })
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Product.update({name: name, image: fileName, url: url},{
            where : {
               id: req.params.id}
        });
        res.status(200).json({msg: 'Successfully updated product'});

    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async(req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "Product Not Found"});
    
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}