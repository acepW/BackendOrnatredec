const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');

const CreateComment = async (req, res) => {
    const {postId, desc} = req.body
    const {id} = req.user

    try {
        let Balasan = 0;
        const comment = await Comment.create({
            userId : id,
            postId,
            desc,
            balasan : Balasan
        }) 

        const commentCount = await Comment.count({ where: { postId: postId } });
        const replyCount = await Reply.count({ where: { postId: postId } });

        const jumlahTanggapan = commentCount + replyCount;

        await Post.update(
            { jumlahTanggapan: jumlahTanggapan },
            { where: { id: postId } }
        );

        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

 const GetComment = async (req, res) =>{
        try {
            const comment = await Comment.findAll({
                include : [
                    {model : User, attributes: ['name']}, 
                    {model : Reply, include: [{model : User, attributes: ['name']}]}
                ]
            })
            res.json({comment})
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    };

const editComment = async (req, res) => {
    const id = req.params.id
    const {desc} = req.body
    const userID = req.user.id;

    try {
        const commentIduser = await Comment.findByPk(id);
        
        if (!commentIduser) {
            return res.status(404).json({ message: "Komentar tidak ditemukan." });
        }

        if (commentIduser.userId !== userID) {
            res.status(505).json({ message: "maaf kamu tidak bisa mengedit komen" });
        }
        
        await Comment.update({
        desc : desc
       },{
        where : {id : id}
       }
    )

    const updatedComment = await Comment.findByPk(id);

        res.json(updatedComment)
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

const deleteComment = async (req, res) => {
    const id = parseInt(req.params.id);
    const userID = req.user.id;
    const userRole = req.user.role;

    try {
        const commentIduser = await Comment.findByPk(id);

        if (!commentIduser) {
            return res.status(403).json({ message: "Komentar tidak ditemukan." });
        }

        const postId = commentIduser.postId;

        if (userRole !== 'super admin' && commentIduser.userId !== userID) {
            return res.status(404).json({ message: "Maaf, kamu tidak bisa menghapus komen ini." });
        }

        await Comment.destroy({ where: { id: id } });
        await Reply.destroy({where: {commentId: id} })

        const commentCount = await Comment.count({ where: { postId: postId } });
        const replyCount = await Reply.count({ where: { postId: postId } });
        const jumlahTanggapan = commentCount + replyCount;

        await Post.update(
            { jumlahTanggapan: jumlahTanggapan },
            { where: { id: postId } }
        );

        res.status(200).json({ message: "Hapus berhasil" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


    module.exports = {
        CreateComment,
        GetComment,
        editComment,
        deleteComment
    }