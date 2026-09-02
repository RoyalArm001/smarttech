const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const configuredDataRoot = process.env.SMARTTECH_CMS_DATA_DIR || process.env.CMS_DATA_DIR || "";
const localDataRoot = configuredDataRoot
  ? path.resolve(configuredDataRoot)
  : path.resolve(__dirname, "data");
const isVercel = Boolean(process.env.VERCEL);
const runtimeDataRoot = isVercel
  ? path.join("/tmp", "smarttech-admin-data")
  : localDataRoot;

const usersFile = path.join(runtimeDataRoot, "users.json");

function ensureDir() {
  try {
    fs.mkdirSync(runtimeDataRoot, { recursive: true });
    return true;
  } catch (error) {
    if (error && (error.code === "EROFS" || error.code === "EACCES")) {
      return false;
    }
    throw error;
  }
}

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  if (!ensureDir()) {
    const error = new Error("Data storage is read-only in this environment");
    error.statusCode = 503;
    throw error;
  }
  const tempPath = usersFile + "." + process.pid + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(users, null, 2) + "\n", "utf8");
  fs.renameSync(tempPath, usersFile);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, storedSalt, storedHash) {
  if (!password || !storedSalt || !storedHash) return false;
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, "sha512").toString("hex");
  return hash === storedHash;
}

function listUsers() {
  const users = readUsers();
  return users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    employeeId: u.employeeId,
    email: u.email,
    message: u.message,
    picture: u.picture,
    createdAt: u.createdAt
  }));
}

function getUserById(id) {
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return null;
  return { ...user };
}

function getUserByUsername(username) {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return null;
  return { ...user };
}

function authenticateUser(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;
  if (!verifyPassword(password, user.salt, user.hash)) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    employeeId: user.employeeId
  };
}

function createUser(data, password) {
  const users = readUsers();
  if (users.find(u => u.username === data.username)) {
    throw new Error("Username already exists");
  }

  const { salt, hash } = hashPassword(password);
  const newUser = {
    id: crypto.randomUUID(),
    username: data.username,
    salt,
    hash,
    role: data.role || "employee",
    employeeId: data.employeeId || null,
    email: data.email || "",
    message: data.message || "",
    picture: data.picture || "",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  const returnUser = { ...newUser };
  delete returnUser.salt;
  delete returnUser.hash;
  return returnUser;
}

function updateUser(id, data, newPassword = null) {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error("User not found");

  const user = users[index];

  if (data.username && data.username !== user.username) {
    if (users.find(u => u.username === data.username)) {
      throw new Error("Username already exists");
    }
    user.username = data.username;
  }

  if (data.role) user.role = data.role;
  if (data.employeeId !== undefined) user.employeeId = data.employeeId;
  if (data.email !== undefined) user.email = data.email;
  if (data.message !== undefined) user.message = data.message;
  if (data.picture !== undefined) user.picture = data.picture;

  if (newPassword) {
    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.hash = hash;
  }

  user.updatedAt = new Date().toISOString();
  users[index] = user;
  writeUsers(users);

  const returnUser = { ...user };
  delete returnUser.salt;
  delete returnUser.hash;
  return returnUser;
}

function deleteUser(id) {
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  if (users.length === initialLength) return false;
  writeUsers(users);
  return true;
}

module.exports = {
  listUsers,
  getUserById,
  getUserByUsername,
  authenticateUser,
  createUser,
  updateUser,
  deleteUser
};
