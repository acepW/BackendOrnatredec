const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');

const CreateComment = async (req, res) => {
    const {postId, desc} = req.body
    const {id} = req.user

    try {
        const comment = await Comment.create({
            userId : id,
            postId,
            desc
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
            res.status(500).json({ message: "maaf kamu tidak bisa mengedit komen" });
        }

       const comment = await Comment.update({
        desc : desc
       },{
        where : {id : id}
       }
    )
        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengedit comment." });
    }
}

    module.exports = {
        CreateComment,
        GetComment,
        editComment
    }