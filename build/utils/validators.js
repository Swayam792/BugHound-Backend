"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectValidator = exports.projectMembersError = exports.projectNameError = exports.createBugValidator = exports.loginValidator = exports.registerValidator = void 0;
const registerValidator = (username, password) => {
    const errors = {};
    if (!username ||
        username.trim() === '' ||
        username.length > 20 ||
        username.length < 3) {
        errors.username = 'Username must be in range of 3-20 characters length.';
    }
    if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
        errors.username = 'Username must have alphanumeric characters only.';
    }
    if (!password || password.length < 6) {
        errors.password = 'Password must be atleast 6 characters long.';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
exports.registerValidator = registerValidator;
const loginValidator = (username, password) => {
    const errors = {};
    if (!username || username.trim() === '') {
        errors.username = 'Username field must not be empty.';
    }
    if (!password) {
        errors.password = 'Password field must not be empty.';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
exports.loginValidator = loginValidator;
const createBugValidator = (title, description, priority) => {
    const errors = {};
    const validPriorities = ['low', 'medium', 'high'];
    if (!title || title.trim() === '' || title.length > 60 || title.length < 3) {
        errors.title = 'Title must be in range of 3-60 characters length.';
    }
    if (!description || description.trim() === '') {
        errors.description = 'Description field must not be empty.';
    }
    if (!priority || !validPriorities.includes(priority)) {
        errors.priority = 'Priority can only be - low, medium or high.';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
exports.createBugValidator = createBugValidator;
const projectNameError = (name) => {
    if (!name || name.trim() === '' || name.length > 60) {
        return 'Project name length must not be more than 60.';
    }
};
exports.projectNameError = projectNameError;
const projectMembersError = (members) => {
    if (!Array.isArray(members)) {
        return 'Members field must be an array.';
    }
    if (members.filter((m, i) => members.indexOf(m) !== i).length !== 0) {
        return 'Members field must not have already-added/duplicate IDs.';
    }
    if (members.some((m) => m.length !== 36)) {
        return 'Members array must contain valid UUIDs.';
    }
};
exports.projectMembersError = projectMembersError;
const createProjectValidator = (name, members) => {
    const errors = {};
    const nameError = (0, exports.projectNameError)(name);
    const membersError = (0, exports.projectMembersError)(members);
    if (nameError) {
        errors.name = nameError;
    }
    if (membersError) {
        errors.members = membersError;
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
exports.createProjectValidator = createProjectValidator;
//# sourceMappingURL=validators.js.map