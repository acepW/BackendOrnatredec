const Post = require("../../models/Forum/posts");
const Report = require("../../models/Forum/report");

const buatReport = async (req, res) => {
    const {id_post, desc_report} = req.body;
    const id = req.user.id
    try {
        const report = await Report.create({
            user_id : id,
            id_post,
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

module.exports = buatReport;

