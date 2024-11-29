const Post   = require('../../models/Forum/posts');
const User   = require('../../models/User/users');
const Comment   = require('../../models/Forum/comments');
 const  Notification   = require('../../models/Forum/notification');
  const Reply  = require('../../models/Forum/reply'); // Pastikan mengimpor model Notification
  const CreateComment = async (req, res, io) => {
    const { postId, desc } = req.body;
    const { id } = req.user;

    try {
        let Balasan = 0;
        const comment = await Comment.create({
            userId: id,
            postId,
            desc,
            balasan: Balasan,
        });

        const commentCount = await Comment.count({ where: { postId: postId } });
        const replyCount = await Reply.count({ where: { postId: postId } });

        const jumlahTanggapan = commentCount + replyCount;

        await Post.update(
            { jumlahTanggapan: jumlahTanggapan },
            { where: { id: postId } }
        );

        // **Kirim notifikasi ke pemilik postingan**
        const post = await Post.findByPk(postId, { include: [{ model: User }] });
        if (post && post.User) {
            const postOwnerId = post.User.id;

            // Simpan notifikasi ke tabel Notification
            await Notification.create({
                type: 'comment',
                message: `User ${req.user.name} commented on your post.`,
                userId: postOwnerId,
                referenceId: comment.id,
                read: false
            }).then(() => {
                console.log("Notifikasi berhasil disimpan!");
            }).catch((err) => {
                console.error("Error menyimpan notifikasi: ", err);
            });
            

            // Emit notifikasi ke frontend
            io.to(postOwnerId).emit("receive_notification", {
                type: "comment",
                message: `User ${req.user.name} commented on your post.`,
                postId: postId,
                commentId: comment.id,
                desc,
            });
        }

        res.json(comment);
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

module.exports = {
  CreateComment,
  deleteComment
}
