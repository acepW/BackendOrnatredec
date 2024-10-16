const Post = require('../../models/Forum/posts');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const User = require('../../models/User/users');
const moment = require('moment')

// Fungsi Update User
const updateUser = async (req, res) => {
    const { username, email, no_hp, tanggalLahir} = req.body;
    const userId = req.params.id; // Ambil ID dari URL
  
    // Cek apakah file foto profil atau background profil diupload
    const photoProfile = req.file ? `/uploads/${req.file.filename}` : null; 
    // const backgroundProfile = req.files?.backgroundProfile ? req.files.backgroundProfile[0].filename : null;
  
    try {
      // Cari user berdasarkan ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // // Update data user
      // user.username = username || user.username;
      // user.email = email || user.email;
      // user.no_hp = no_hp || user.no_hp;
      // user.alamat = alamat || user.alamat;
      // user.tanggalLahir = tanggalLahir || user.tanggalLahir;
  
      // Update foto profil dan background profil jika ada file baru
      if (photoProfile) {
        user.photoProfile = photoProfile;
      }
      // if (backgroundProfile) {
      //   user.backgroundProfile = backgroundProfile;
      // }
      const tanggalBaru = moment(tanggalLahir).format('YYYY-MM-DD');
      await User.update({
        username : username,
        email : email,
        no_hp : no_hp,
        photoProfile ,
        tanggalLahir : tanggalBaru
      }, {
        where : {id : userId}
      })

      await Alamat.update({
        nohp : no_hp
      },{
        where : {userId : userId}
      })
      const profilBaru = await User.findOne({ where: { id : userId} });
  
      res.status(200).json({ success: true, message: 'User updated successfully', profilBaru });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Fungsi Delete User
const deleteUser = async (req, res) => {
    const userId = req.params.id; // Ambil ID dari URL
  
    try {
      // Cari user berdasarkan ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Hapus user dari database
      await user.destroy();
  
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
const detailUser = async (req, res) => {
  const id = req.params.id
  try {
   const user = await User.findOne({
      where: { id: id },
      include: [
        { model: Alamat, attributes: ['kota_kabupaten'] }
      ]
   });
     const posts = await Post.findAll({where : {userId : id}})
     const Postingan = posts.map(post => ({
      id: post.id,
      judul: post.judul,
      desc: post.desc,
      fotoKonten: post.fotoKonten,
      userId: post.userId,
      kategori_forum: post.kategori_forum,
      jumlahTanggapan: post.jumlahTanggapan,
      jumlahView: post.jumlahView,
      jumlahReport: post.jumlahReport,
      createdAt: moment(post.createdAt).format('YYYY-MM-DD') 
     }));
    
    const Postuser = await Post.count({ where: { userId: id } })
    const TransaksiUser = await TransaksiProduk.count({ where: { user_id: id } })
    res.status(200).json({user, Postingan, Postuser, TransaksiUser})
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}
  
  module.exports = {
    updateUser,
    deleteUser,
    detailUser
  }