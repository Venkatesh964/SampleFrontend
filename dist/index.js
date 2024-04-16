"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.DB_URL}`); // 8626
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const mongoose = require('mongoose');
console.log(process.env.DB_URL);
mongoose.connect(process.env.DB_URL);
const Employee1 = new mongoose.Schema({
    name: String,
    age: Number,
    Department: String,
    title: String,
    DOB: String
});
const Employee = mongoose.model('Employee', Employee1);
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const e = yield Employee.create({
            name: req.body.name,
            age: req.body.age,
            Department: req.body.Department,
            title: req.body.title,
            DOB: req.body.DOB
        });
        return res.json({ e });
    }
    catch (e) {
        return res.status(400).json({ msg: e });
    }
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield Employee.find({});
        return res.json(response);
    }
    catch (e) {
        return res.status(400).json({ msg: e });
    }
    ;
}));
app.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body._id;
        yield Employee.updateOne({ _id: id }, req.body);
        return res.json({ msg: "updated successfully" });
    }
    catch (e) {
        return res.status(403).json({ er: e });
    }
}));
app.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nameFilter = req.query.name || "";
    const titleFilter = req.query.title || "";
    console.log(nameFilter);
    console.log(titleFilter);
    try {
        let r = "";
        if (nameFilter == "" && titleFilter != "") {
            console.log("first");
            r = yield Employee.find({ title: {
                    "$regex": titleFilter, $options: 'i'
                } });
        }
        else if (nameFilter != "" && titleFilter == "") {
            console.log("second");
            r = yield Employee.find({ name: {
                    "$regex": nameFilter, $options: 'i'
                } });
        }
        else {
            console.log("third");
            r = yield Employee.find({ $and: [{
                        name: {
                            "$regex": nameFilter
                        }
                    }, {
                        title: {
                            "$regex": titleFilter
                        }
                    }] });
        }
        // console.log(r);
        return res.json(r);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}));
app.listen(3000, () => {
    console.log("listening on port 3000");
});
