const express = require("express");
const router = express.Router();
const { addUser ,
    getUsers, 
    getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  updateUserStatus
 } = require("../controllers/userController");
 const { addUsersBulk } = require("../controllers/userController");
 const { exportUsersCSV } = require("../controllers/userController");



router.post("/", addUser); 
router.get("/search", searchUsers);  
router.get("/export/csv", exportUsersCSV);
router.get("/", getUsers);

router.patch("/:id/status", updateUserStatus);
router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.post("/bulk", addUsersBulk);

router.delete("/:id", deleteUser);



module.exports = router;
