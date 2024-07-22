import { Request, Response } from "express";
import UserService from "../service/user-service";
import FollowService from "../service/follow-service";

async function find(req: Request, res: Response) {
  const userLogged = res.locals.user;

  try {
    const user = res.locals.user;
    const search = req.query.search as string; //  bikin const ( query string step 1)
    const users = await UserService.find(search, user.id);
    const newUser = users.map((user) => {
      const followers = user.followers;
      return {
        ...user,
        isFollowed: followers.some(
          (follower) => follower.followerId == userLogged.id
        ),
      };
    });

    console.log(newUser);

    return res.json(newUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function findOneProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserService.findOneProfile(Number(id));

    if (!user) {
      return res.status(404).json({ message: "User not found ya" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // pengecekan
    const user = await UserService.findOneProfile(Number(id));
    if (!user)
      res.status(404).json({
        message: "Thread not found!",
      });

    // cundus
    const editedProfile = await UserService.updateProfile(Number(id), req.body);
    res.json(editedProfile);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}

async function follow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = res.locals.user;
    const follow = await FollowService.follow(parseInt(id), user.id);

    return res.status(200).json(follow);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}

async function unfollow(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const unfollow = await FollowService.follow(parseInt(id), user.id);

    res.status(200).json(unfollow);
  } catch (error) {
    res.status(500).json({
      messahe: error,
    });
  }
}

export default { find, updateProfile, findOneProfile, follow, unfollow };
