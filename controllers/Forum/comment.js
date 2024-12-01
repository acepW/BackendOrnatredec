const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');
const Comments = require('../../models/Forum/comments');
const  Notification   = require('../../models/Forum/notification');


const CreateComment = async (req, res) => {
    const {postId, desc} = req.body
    const {id} = req.user

  try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan." });
      }
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Postingan tidak ditemukan." });
      }
  
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

      // Buat notifikasi untuk pemilik postingan
      if (post.userId !== id) {
       const notif = await Notification.create({
          userId: post.userId, // Pemilik postingan
          type: "comment", // Tipe notifikasi
          message: `${user.username} memberikan komentar baru pada postingan Anda: "${desc}"`,
          referenceId: comment.id, // ID komentar
          referenceType: "comment", // Tipe referensi
       });
        console.log(notif);
        return res.status(200).json(notif)
    }
        return res.status(201).json(comment)
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

// Fungsi untuk menghapus komentar
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

const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneComment = async (req, res) => {
    const id = req.params.id;
    try {
        const coment = await Comments.findByPk(id)
        if (!coment) {
           return res.status(400).json({ message: "komen tidak ditemukan" });
        }
        return res.status(200).json(coment)
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

// const CreateComment = async (req, res, io) => {
//   const { postId, desc } = req.body;
//   const { id } = req.user;

//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: "User tidak ditemukan." });
//     }

//     const post = await Post.findByPk(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Postingan tidak ditemukan." });
//     }

//     let Balasan = 0;
//     const comment = await Comment.create({
//       userId: id,
//       postId,
//       desc,
//       balasan: Balasan,
//     });

//     const commentCount = await Comment.count({ where: { postId } });
//     const replyCount = await Reply.count({ where: { postId } });

//     const jumlahTanggapan = commentCount + replyCount;

//     await Post.update(
//       { jumlahTanggapan },
//       { where: { id: postId } }
//     );

//     // Notifikasi untuk pemilik postingan
//     if (post.userId !== id) {
//       const notification = await Notification.create({
//         userId: post.userId,
//         type: "comment",
//         message: `${user.username} memberikan komentar baru pada postingan Anda: "${desc}"`,
//         referenceId: comment.id,
//         referenceType: "comment",
//       });

//       // Emit notifikasi ke namespace Socket.IO
//       io.of("/notifications").to(post.userId.toString()).emit("newNotification", {
//         id: notification.id,
//         message: notification.message,
//       });
//     }

//     res.json(comment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

    module.exports = {
        CreateComment,
        GetComment,
        editComment,
        deleteComment,
        getOneComment,
        getNotifications
}
