const USERS_KEY = "users";
const AUTH_KEY = "auth_user";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(form) {
  let vaild = true;

  if (form.name.trim() === "") {
    alert("Please enter name");
    vaild = false;
  } else if (isNaN(form.age)) {
    alert("Please entre number only");
    vaild = false;
  } else if (form.pass.trim() === "") {
    alert("Please enter password");
    vaild = false;
  } else if (form.pass !== form.cpass) {
    alert("Password not match");
    vaild = false;
  }

  if (!vaild) return { ok: false };

  let users = getUsers();

  let alreadyuser = users.find((e) => e.email === form.email);
  if (alreadyuser) {
    alert("Already a User");
    return { ok: false };
  }

  users.push(form);
  setUsers(users);
  alert("Sign up success");
  return { ok: true };
}

export function login({ email, pass }) {
  const users = getUsers();
  const found = users.find((u) => u.email === email && u.pass === pass);

  if (!found) {
    alert("Invalid Email or Password");
    return { ok: false };
  }

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      email: found.email,
      name: found.name,
    })
  );

  alert("Login success");
  return { ok: true, user: found };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthUser() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
}

export function isLoggedIn() {
  const u = getAuthUser();
  return !!u?.email;
}

// ===== APPOINTMENTS =====
const APPTS_KEY = "appointments";

export function getAppointments() {
  return JSON.parse(localStorage.getItem(APPTS_KEY)) || [];
}

export function saveAppointment(appt) {
  const all = getAppointments();
  all.unshift(appt);
  localStorage.setItem(APPTS_KEY, JSON.stringify(all));
}

export function getAppointmentsForUser(email) {
  return getAppointments().filter((a) => a.userEmail === email);
}


export function cancelAppointment(id) {
  const updated = getAppointments().filter((a) => a.id !== id);
  localStorage.setItem(APPTS_KEY, JSON.stringify(updated));
  return updated;
}
