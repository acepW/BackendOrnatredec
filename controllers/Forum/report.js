const Post = require("../../models/Forum/posts");
const Report = require("../../models/Forum/report");
const { Op } = require('sequelize');    
const User = require("../../models/User/users");

const buatReport = async (req, res) => {
    const {id_post, desc_report} = req.body;
    const id = req.user.id
    try {
        const report = await Report.create({
            user_id : id,
            id_post : id_post,
            desc_report
        })
        const jumlahreport = await Report.count({where : {id_post : id_post}})

    await Post.update({
        jumlahReport : jumlahreport
    },{where : {id : id_post}})

    res.status(200).json(report)
    } catch (error) {
    res.status(500).json({message : error.message})
    }
    
}

const getReport = async (req, res) => {
    try {
        const PostGet = await Post.findAll();
        const postReport = PostGet.jumlahReport;
        if (postReport == 0) {
            res.json('tidak ada ulasan yang direport')
        }
        const post = await Post.findAll({
           where: {
                 jumlahReport: { [Op.gt]: 0 }
            },
            include: [
                { 
                    model: User, 
                    attributes: ['username', 'photoProfile'] 
                },
                {
                    model: Report,
                    attributes : ['desc_report']
                }
            ]
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    buatReport,
    getReport
};

