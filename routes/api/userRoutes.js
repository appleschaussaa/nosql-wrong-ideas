const router = require('express').Router();

const {
    getUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/userController');

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

router
    .route('/:id/friends/:friendsId')
    .post(addFriend)
    .delete(removeFriend);


module.exports = router;