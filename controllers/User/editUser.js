const User = require('../../models/User/users'); 

// Fungsi Update User

const updateUser = async (req, res) => {
    const { username, email, no_hp, role } = req.body;
    const userId = req.params.id; // Ambil ID dari URL
  
    // Cek apakah file foto profil atau background profil diupload
    const photoProfile = req.files?.photoProfile ? req.files.photoProfile[0].filename : null;
    const backgroundProfile = req.files?.backgroundProfile ? req.files.backgroundProfile[0].filename : null;
  
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
      user.role = role || user.role;
  
      // Update foto profil dan background profil jika ada file baru
      if (photoProfile) {
        user.photoProfile = photoProfile;
      }
      if (backgroundProfile) {
        user.backgroundProfile = backgroundProfile;
      }
  
      // Simpan perubahan
      await user.save();
  
      res.status(200).json({ success: true, message: 'User updated successfully', user });
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
  
  module.exports = {
    updateUser,
    deleteUser
  }