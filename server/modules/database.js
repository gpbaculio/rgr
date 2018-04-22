import Todo from './models/Todo';
import User from './models/User';
import Notification from './models/Notification';
import * as auth from './auth'

export async function createTodo(text, userId) {
  try {
    let newTodo = new Todo({ text, userId });
      await newTodo.save();
      newTodo = await Todo.findOne({ _id: newTodo._id }).populate('userId');
    return newTodo;
  } catch (e) {
    console.log(`FAILED to CREATE TODO ${text} = `, e);
    return null;
  }
}

export async function newNotification(todoId, likerId) {
  try {
    console.log('newNotification likerId = ', likerId);
    console.log('newNotification todoId = ', todoId);
    const newNotification = new Notification({ likerId, todoId });
      await newNotification.save();
      const latestNotification = await Notification.findOne({ _id: newNotification._id })
              
    return latestNotification;
  } catch (e) {
    console.log(`FAILED to CREATE NOTIFICATION `, e);
    return null;
  }
}

export async function registerUser(displayName, email, password) {
  try {
    const newUser = new User({ displayName, email, password });
    await newUser.save();
  } catch (e) {
    console.log(`FAILED to REGISTER USER ${displayName} = `, e);
    return null;
  }
}

export async function getAllTodosByViewer(userId) { // by default, status = 'any'
  try {
    const todos = await Todo.find({userId}).populate('userId').sort({createdAt: 'descending'});
    console.log('getAllTodosByViewer todos = ', todos);
    return todos;
  } catch (e) {
    console.log(`FAILED to RETRIEVE ALL TODOS BY VIEWER! ${userId} = `,e);
    return null;
  }
}

export async function getUserNotofications(userId, userIdForRefetch) {
  try {
    if(userIdForRefetch) {
    const {user:userRefetch} = await auth.getUser(userIdForRefetch)
    const todos = await Todo.find({userId: userRefetch._id}).sort({createdAt: 'descending'});
    const todoIds = todos.map(({ _id }) => _id.toString());
    const notifications = await Notification.find({ todoId: { $in: todoIds } }) //https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
    return notifications.filter(n => n.likerId.toString() !== userRefetch._id.toString());
    }
    const todos = await Todo.find({userId}).sort({createdAt: 'descending'});
    const todoIds = todos.map(({ _id }) => _id.toString());
    const notifications = await Notification.find({ todoId: { $in: todoIds } }) //https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
    console.log('userId = ', userId);
    return notifications.filter(n => n.likerId.toString() !== userId.toString());
  } catch (e) {
    console.log(`FAILED to RETRIEVE USER id ${userId} = `, e);
    return null;
  }
}

export async function getPublicTodos() {
  try {
    const publicTodos = await Todo.find({}).populate('userId').sort({createdAt: 'descending'}); // so we can see the latest todo added
    return publicTodos;
  } catch (e) {
    console.log('FAILED to RETRIEVE PUBLIC TODOS = ', e)
  }
}

export async function getTodo(todoId) {
  try {
    const todo = await Todo.findOne({ _id: todoId }).populate('userId');
    console.log('todo found! node = ', todo)
    return todo;
  } catch (e) {
    console.log(`FAILED to RETRIEVE TODO id ${todoId} = `, e);
    return null;
  }
}

export async function getUser(userId) {
  try {
    const user = await User.findOne({_id: userId});
    return user;
  } catch (e) {
    console.log(`FAILED to RETRIEVE USER id ${userId} = `, e);
    return null;
  }
}

export async function getNotification(notificationId) {
  try {
    const notification = await Notification.findOne({_id: notificationId});
    return notification;
  } catch (e) {
    console.log(`FAILED to RETRIEVE NOTIFICATION = `, e);
    return null;
  }
}

export async function renameTodo(todoId, text, prevText) {
  try {
    return await Todo.findOneAndUpdate({ _id: todoId }, { $set: { text: text } }, { new: true });
  } catch (e) {
    console.log(`FAILED to RENAME todo id ${todoId} = `, e);
    return null;
  }
}
export async function seenAllNotification(ids) {
  const notifs = ids.map(async (id) => {
    return await Notification.findOneAndUpdate({ _id: id }, { $set: { seen: true } }, { new:true });       
  });
  console.log('notifs = ', notifs);
  return notifs;
}
export async function likeTodo(todoId, userId) { // userId is likerId
  try {
    const todo = await Todo.findOne({_id: todoId}).populate('userId');
    var updatedLikersUserId, updatedLikes;
    const userLiked = todo.likersUserId.map(id => id.toString()).includes(userId.toString());
    if (userLiked) {
      updatedLikersUserId = todo.likersUserId.map(id => id.toString()).filter( id => id !== userId.toString());
      updatedLikes = Number(todo.likes) - 1;
    } else if (!userLiked) {
      updatedLikersUserId = [...todo.likersUserId.map(id => id.toString()), userId];
      updatedLikes = Number(todo.likes) + 1;
    }
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { $set: {  likersUserId: updatedLikersUserId, likes: updatedLikes } },
      { new: true } // return latest
    ).populate('userId');
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to RENAME todo id ${todoId} = `, e);
    return null;
  }
}
export async function toggleTodoStatus(todoId, status, text) {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {  _id: todoId },
      { $set: { complete: !status } },
      { new: true }
    );
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to TOGGLE TODO id ${todoId} = `, e);
    return null;
  }
}

export async function removeTodo(id, text) {
  try {
    await Todo.remove({ id });
    return id;
  } catch (e) {
    console.log(`FAILED to REMOVE TODO id ${id} = `, e);
    return null;
  }
}