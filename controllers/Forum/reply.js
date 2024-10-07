const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');

 const createReply = async (req, res) => {
        const {commentId, desc} = req.body
        const {id} = req.user
        try {
            const comment = await Comment.findOne({ where: { id: commentId } });

            if (!comment) {
                return res.status(403).json({ message: "Komentar tidak ditemukan." });
            }

            const postId = comment.postId;
            const reply = await Reply.create({
                userId : id,
                commentId,
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

            const jumlahBalasan = await Reply.count({ where: { commentId: commentId } });
            await Comment.update({
                balasan : jumlahBalasan
            }, {
                where : {id: commentId}
            })

            res.json(reply)
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    }

    const editReply = async (req, res) => {
        const id = req.params.id
        const {desc} = req.body
        const userID = req.user.id;
    
        try {
            const replyIduser = await Reply.findByPk(id);
            
            if (!replyIduser) {
                return res.status(404).json({ message: "reply tidak ditemukan." });
            }
    
            if (replyIduser.userId !== userID) {
                res.status(403).json({ message: "maaf kamu tidak bisa mengedit reply" });
            }
    
            await Reply.update({
            desc : desc
           },{
            where : {id : id}
           }
        )
        const updatedReply = await Reply.findByPk(id);
        
            res.json(updatedReply)
        } catch (error) {
            res.status(500).json({ message : error.message });
        }
    }


    const deleteReply = async (req, res) => {
        const id = parseInt(req.params.id);
        const userID = req.user.id;
        const userRole = req.user.role;

        try {
            const replyIduser = await Reply.findByPk(id);

            if (!replyIduser) {
                return res.status(404).json({ message: "Reply tidak ditemukan." });
            }

            const postId = replyIduser.postId;

            if (userRole !== 'super admin' && replyIduser.userId !== userID) {
                return res.status(403).json({ message: "Maaf, kamu tidak bisa menghapus reply ini." });
            }
    
            await Reply.destroy({where: {id:id} })
            const commentCount = await Comment.count({ where: { postId: postId } });
            const replyCount = await Reply.count({ where: { postId: postId } });
            const jumlahTanggapan = commentCount + replyCount;
    
            await Post.update(
                { jumlahTanggapan: jumlahTanggapan },
                { where: { id: postId } }
            );

            res.status(200).json({ message: "Delete successful" });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };


    module.exports = {
        createReply,
        editReply,
        deleteReply
    }