const Alamat = require('../../models/User/alamat');
const User = require('../../models/User/users');

// Fungsi Update User
const updateUser = async (req, res) => {
    const { username, email, no_hp, alamat, tanggalLahir} = req.body;
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
  
      // Update data user
      
      user.username = username || user.username;
      user.email = email || user.email;
      user.no_hp = no_hp || user.no_hp;
      user.alamat = alamat || user.alamat;
      user.tanggalLahir = tanggalLahir || user.tanggalLahir;
  
      // Update foto profil dan background profil jika ada file baru
      if (photoProfile) {
        user.photoProfile = photoProfile;
      }
      // if (backgroundProfile) {
      //   user.backgroundProfile = backgroundProfile;
      // }
  
      await User.update({
        username : username,
        email : email,
        no_hp : no_hp,
        alamat : alamat,
        photoProfile ,
        tanggalLahir : tanggalLahir
      }, {
        where : {id : userId}
      })
      // Simpan perubahan
      await user.update();
  
      res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

const buatAlamat = async (req, res) => {
  const {provinsi, jalan, rtrw, patokan, nama, kategori_alamat, alamatUtama} = req.body;
  const {id} = req.user;
  try {
    const noHp = await User.findByPk(id);
    const noPonsel = noHp.no_hp;
    const alamat = await Alamat.create({
      userId : id,
      provinsi : provinsi,
      jalan : jalan,
      rtrw : rtrw,
      patokan : patokan,
      nama : nama,
      nohp : noPonsel,
      kategori_alamat: kategori_alamat,
      alamatUtama : alamatUtama
    })
    res.status(200).json(alamat)
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}

const editAlamat = async (req, res) => {
  const {provinsi, jalan, rtrw, patokan, nohp, nama, kategori_alamat, alamatUtama} = req.body;
  const id = req.params.id;
  try {
    const address = await Alamat.findOne({where : {userId : id}});
    if (!address) {
      res.status(400).json({message : "alamat tidak ditemukan"})
    }
    await Alamat.update({
      provinsi : provinsi,
      jalan : jalan,
      rtrw : rtrw,
      patokan : patokan,
      nama : nama,
      nohp : nohp,
      kategori_alamat: kategori_alamat,
      alamatUtama : alamatUtama
    }, {
      where : {userId : id}
    })

    const user = await User.findByPk(id);
    await User.update({
      no_hp : nohp
    },{
      where : {id : user.id}
    })

    const alamatBaru = await Alamat.findOne({ where: { userId: id } });
    res.status(200).json(alamatBaru)
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}

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
  
  module.exports = {
    updateUser,
    deleteUser,
    buatAlamat,
    editAlamat
  }