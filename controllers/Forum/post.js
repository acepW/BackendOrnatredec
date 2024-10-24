const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');
const multer = require('multer');
const path = require('path');
const { where } = require('sequelize');
const View = require('../../models/Forum/view');
const Report = require('../../models/Forum/report');

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

const PostUlasanForum = async (req, res) => {
    const { judul, desc, kategori_forum } = req.body;
    const { id } = req.user;
    const url = req.file ? `/uploads/${req.file.filename}` : null; 
    let jumlahTanggapan = 0;
    let jumlahView = 0;
     let jumlahReport = 0
    try {
        const post = await Post.create({
            userId: id,
            judul : judul,
            desc: desc,
            img: url,
            jumlahTanggapan,
            kategori_forum : kategori_forum,
            jumlahView,
            jumlahReport

        });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editPostingan = async (req, res) => {
    const id = req.params.id
    const {desc, judul, kategori_forum} = req.body
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
        kategori_forum : kategori_forum,
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

const getPostKategoriTanaman = async (req, res) => {
   const kategori = 'tanaman';
    try {
        const post = await Post.findAll({
            where : {kategori_forum : kategori},
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

const getPostKategoriIkan = async (req, res) => {
    const kategori = 'ikan';
    try {
        const post = await Post.findAll({
            where : {kategori_forum : kategori},
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

const getPostKategoriBurung = async (req, res) => {
    const kategori = 'burung';
    try {
        const post = await Post.findAll({
            where : {kategori_forum : kategori},
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

const filterKategori = async (req, res) => {
    const kategori = req.query.kategori
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page) 
    const offset = (page - 1) * limit;

    try {
        const post = await Post.findAll({
            where : {kategori_forum : kategori},
            limit: limit,
            offset: offset,
            include: [
                { 
                    model: User, 
                    attributes: ['username', 'photoProfile'] 
                },
                { 
                    model: Comment, 
                    limit: 5,
                    offset: 0,
                    include: [
                        { model: User, attributes: ['username'] },
                        { 
                            model: Reply, 
                            limit: 5,
                            offset: 0,
                            include: [{ model: User, attributes: ['username'] }]
                        }
                    ]
                }
            ]
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOnePost = async (req, res) => {
    const idPost = req.params.id; 
    const id = req.user.id;
    try {
        const post = await Post.findAll({
            where : {kategori_forum : kategori},
            limit: limit,
            offset: offset,
            include: [
                { 
                    model: User, 
                    attributes: ['username'] 
                },
                { 
                    model: Comment, 
                    limit: 5,
                    offset: 0,
                    include: [
                        { model: User, attributes: ['username'] },
                        { 
                            model: Reply, 
                            limit: 5,
                            offset: 0,
                            include: [{ model: User, attributes: ['username'] }]
                        }
                    ]
                }
            ]
        });
    
            const view = await View.findOne({where : {userId : id, postId : idPost}})
    
            if (!view) {
                await View.create({
                    userId : id,
                    postId : idPost,
                })
            }

            jumlahview = await View.count({where : {postId : idPost}})

            await Post.update({
                jumlahView : jumlahview
            }, {
                where :  {id : idPost}
            })
            
            res.json(post);
        res.json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deletePost = async (req, res) => {
    const id = parseInt(req.params.id);
    const userID = req.user.id;
    const userRole = req.user.role;
    try {
        const post = await Post.findByPk(id);
        
        if (!post) {
            return res.status(404).json({ message: "Komentar tidak ditemukan." });
        }

        if (userRole !== 'super admin' && post.userId !== userID) {
            return res.status(403).json({ message: "Maaf, kamu tidak bisa menghapus komen ini." });
        }

        await Post.destroy({where: {id:id} })
        await Comment.destroy({where: {postId: id} })
        await Reply.destroy({where: {postId: id} })

        res.status(200).json({ message: "Delete successful" });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const simpanPostingan = async (req, res) => {
    const { id } = req.user; 
    const { idPost } = req.body;

    try {
        const post = await Post.findOne({ where : {id : idPost}})

        if(!post){
            res.status(400).json({ message : "maaf postingan tidak ditemukan" })
        }

        const simpanan = await simpanPost.findAll({ where : {userId : id}})
        if(simpanan.postId === idPost){
            res.status(403).json({ message : "maaf postingan sudah ada" })
        }

        const simpan = await simpanPost.create({
            userId: id,
            postId: idPost
        });
        res.status(200).json(simpan);
    } catch (error) {
        res.status(500).json({ message : error.message })
    }
}

const getSimpanPostingan = async (req, res) => {
    const { id } = req.user; 
    try {
        const simpananPostingan = await simpanPost.findAll({where : {userId : id}})

        if (simpananPostingan.length === 0) {
            return res.status(505).json({ message : "maaf anda tidak memiliki simpanan postingan" })
        }

        res.status(200).json(simpananPostingan);
    } catch (error) {
        res.status(500).json({ message : error.message })
    }
}


const   PostTerpopuler = async (req, res) => {
    try {
        const populer = await Post.findAll({
            order : [['jumlahTanggapan', 'DESC']]
        })
        res.status(200).json(populer)
    } catch (error) {
        res.status(500).json({ message : error.message })
    }
}
    
const jumlahpostinganUser = async (req, res) => {
    const id = req.user.id;
    try {
        const postingan = await Post.findAll({where : {userId : id}})
        if (postingan.length === 0) {
            return res.status(404).json({ message : "kamu belum memposting apapun di forum" })
        }
        res.status(200).json(postingan)
    } catch (error) {
        res.status(500).json({ message : error.message })
    }
}

const getforumReport = async(req, res) => {
    const { id } = req.params;
    try {
        const forumReport = await Post.findOne({
            where: { id: id },
            include: [
                {
                    model: Report,
                   include: [{ model: User, attributes: ['username', 'photoprofile'] }]
                },
                {
                    model : User
                }
            ]
        })
        res.status(200).json(forumReport)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

module.exports = {
    PostUlasanForum,
    upload,
    getPost,
    getOnePost,
    editPostingan,
    deletePost,
    getPostKategoriBurung,
    getPostKategoriIkan,
    getPostKategoriTanaman,
    filterKategori,
    simpanPostingan,
    getSimpanPostingan,
    jumlahpostinganUser,
    PostTerpopuler,
    getforumReport
}
