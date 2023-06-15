"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = __importDefault(require("./BaseModel"));
const User_1 = require("./User");
const Bug_1 = require("./Bug");
const Member_1 = require("./Member");
let Project = class Project extends BaseModel_1.default {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60 }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", User_1.User)
], Project.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Member_1.Member, (member) => member.project),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Project.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Bug_1.Bug, (bugs) => bugs.project),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Project.prototype, "bugs", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)({ name: 'projects' })
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map