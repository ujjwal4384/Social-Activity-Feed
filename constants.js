exports.ACTIVITY_TYPE={
    LIKE:'like',
    FOLLOW:'follow',
    POST:'post',
}

exports.ACTIVITY_WALL_MESSAGE = {
  LIKE:(username, target_username) => `${username} liked ${target_username}'s post`,
  FOLLOW:(username, target_username) => `${username} followed ${target_username}`,
  POST:(username) => `${username} made a post`,  
};

exports.PRONOUNS = {
    YOU: "you",
    YOUR:"your",
}

exports.MAX_ACTIVITY_WALL_LENGTH = 10;