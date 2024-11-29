const Post = require('../../models/Forum/posts');
const Comment = require('../../models/Forum/comments'); 
const Reply = require('../../models/Forum/reply');
const User = require('../../models/User/users');
const Comments = require('../../models/Forum/comments');
const  Notification   = require('../../models/Forum/notification');

  const CreateComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id; // ID pengguna yang membuat komentar
  
    try {
      // Buat komentar
      const comment = await Comment.create({
        userId,
        postId,
        content,
      });
  
      // Cari postingan terkait
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Postingan tidak ditemukan." });
      }
  
      // Buat notifikasi untuk pemilik postingan
      if (post.userId !== userId) {
        await Notification.create({
          userId: post.userId, // Pemilik postingan
          type: "comment", // Tipe notifikasi
          message: `Komentar baru pada postingan Anda: "${content}"`,
          referenceId: comment.id, // ID komentar
          referenceType: "comment", // Tipe referensi
        });
      }
  
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

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

    module.exports = {
        CreateComment,
        GetComment,
        editComment,
        deleteComment,
        getOneComment
        getNotifications
}
