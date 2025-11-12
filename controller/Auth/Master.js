const TeamMembers = require("../../model/Auth/Master");

class Team {
  async addTeamMember(req, res) {
    try {
      const {
        name,
        password,
        email,
        user,
        clients,
        orders,
        quotation,
        paymentreports,
        termsandcondition,
        product
      } = req.body;
      const newTeamMember = new TeamMembers({
        name,
        password,
        email,
        user,
        clients,
        orders,
        quotation,
        paymentreports,
        termsandcondition,
        product
      });
      await newTeamMember.save();
      res.status(200).json({
        status: true,
        success: "Team Member Added",
        data: newTeamMember,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loginTeamMember(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await TeamMembers.findOne({ email });
      console.log("user", user);
      if (!user) {
        return res.status(400).json({ message: "Email does not match" });
      }
      if (user.password !== password) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      res.status(200).json({
        message: "Login Success",
        user: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getTeammember(req, res) {
    try {
      const teamMembers = await TeamMembers.findOne({ _id: req.params.id });
      if (teamMembers) {
        return res.status(200).json({
          status: true,
          data: teamMembers,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
  async getAllTeammember(req, res) {
    try {
      const allmembers = await TeamMembers.find();

      return res.status(200).json({
        status: true,
        data: allmembers,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }

  async updateMember(req, res) {
    try {
      const teamMemberId = req.params.id;
      const {
        name,
        password,
        email,
        user,
        clients,
        orders,
        quotation,
        paymentreports,
        termsandcondition,
        product
      } = req.body;

      let teamMember = await TeamMembers.findOne({ _id: teamMemberId });
      if (!teamMember) {
        return res.status(404).json({
          status: 404,
          error: "Id not found",
        });
      }

      await TeamMembers.findOneAndUpdate(
        { _id: teamMemberId },
        {
          name,
          password,
          email,
          user,
        clients,
        orders,
        quotation,
        paymentreports,
        termsandcondition,
        product
        },
        {
          new: true,
        }
      );
      console.log("teamMember", teamMember);
      res.status(200).json({
        status: true,
        success: "Updated",
        data: teamMember,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTeammember(req, res) {
    try {
      const _id = req.params.id;
      const member = await TeamMembers.findByIdAndDelete(_id);
      if (!member) {
        return res
          .status(404)
          .json({ status: false, message: "Member not found" });
      }
      return res
        .status(200)
        .send({ status: true, success: "Member deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const TeamController = new Team();
module.exports = TeamController;
