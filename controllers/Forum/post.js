const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');
const multer = require('multer');
const path = require('path');
const { where } = require('sequelize');

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Tentukan folder tempat file akan disimpan
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Tentukan nama file
    }
});

// Filter untuk menentukan jenis file yang diizinkan
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File type not allowed!');
    }
};

// Inisialisasi multer dengan konfigurasi penyimpanan
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000 }, // Batas ukuran file dalam byte (1MB)
    fileFilter: fileFilter 
});

const PostUlasan = async (req, res) => {
    const { judul, desc } = req.body;
    const { id } = req.user;
    const url = req.file ? `/uploads/${req.file.filename}` : null; 
    let jumlahTanggapan = 0;
    try {
        const post = await Post.create({
            userId: id,
            judul : judul,
            desc: desc,
            img: url,
            jumlahTanggapan
        });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editPostingan = async (req, res) => {
    const id = req.params.id
    const {desc, judul} = req.body
    const userID = req.user.id;
    const url = req.file ? `/uploads/${req.file.filename}` : null; 
    try {
        const postIduser = await Post.findByPk(id);
        
        if (!postIduser) {
            return res.status(404).json({ message: "postingan tidak ditemukan." });
        }

        if (postIduser.userId !== userID) {
            res.status(404).json({ message: "maaf kamu tidak bisa mengedit postingan" });
        }

       await Post.update({
        judul : judul,
        desc : desc,
        img : url
       },{
        where : {id : id}
       }
    )

    const updatedPost = await Post.findByPk(id);

        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengedit comment." });
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findAll({
            include: [
                { 
                    model: User, 
                    attributes: ['username'] 
                },
                { 
                    model: Comment, 
                    include: [
                        { model: User, attributes: ['username'] },
                        { 
                            model: Reply, 
                            include: [{ model: User, attributes: ['username'] }]
                        }
                    ]
                }
            ]
        });
        res.json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOnePost = async (req, res) => {
    const id = req.params;
    try {
        const Post = await post.findOne({ 
            where : {id : id},
            include: [
                { 
                    model: User, 
                    attributes: ['name'] 
                },
                { 
                    model: Comment, 
                    include: [
                        { model: User, attributes: ['name'] },
                        { 
                            model: Reply, 
                            include: [{ model: User, attributes: ['name'] }]
                        }
                    ]
                }
            ]
        });
        res.json({ Post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const deletePost = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await Post.destroy({where: {id:id} })
        res.status(200).json({ message: "Delete successful" });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    PostUlasan,
    upload,
    getPost,
    getOnePost,
    editPostingan,
    deletePost
};
