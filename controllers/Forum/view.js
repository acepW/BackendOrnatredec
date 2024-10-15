const View = require('../../models/Forum/view');

const logView = async (req, res) => {
    try {
        const existingView = await View.findOne({
            where: { userId: userId, postId: postId }
        });

        if (!existingView) {
            await View.create({ userId: userId, postId: postId, jumlahView: viewCount });

            const viewCount = await View.count({ where: { postId: postId } });
            await View.update({ jumlahView: viewCount });
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const viewPost = async (req, res) => {
    const { postId } = req.body;
    const { id } = req.user; // Mengambil userId dari req.user

    if (!id) {
        return res.status(401).json({ message: "Unauthorized" }); // Cek apakah user sudah login
    }

    try {
        await logView(id, postId); // Menggunakan id dari user yang sudah login
        const viewCount = await View.count({ where: { postId: postId } });
        res.json({ message: "View logged", views: viewCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = viewPost;
