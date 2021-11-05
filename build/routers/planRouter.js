"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _planController = require("../controllers/planController");

var _middleware = require("../middleware");

var planRouter = _express["default"].Router();

// /plans/~~
planRouter.get("/:id([0-9a-f]{24})", _middleware.protectMiddleware, _planController.seePlan);
planRouter.post("/:id([0-9a-f]{24})", _middleware.protectMiddleware, _planController.sendInvitation);
planRouter.get("/:id([0-9a-f]{24})/edit", _middleware.protectMiddleware, _planController.editPlan);
planRouter.get("/:id([0-9a-f]{24})/delete", _middleware.protectMiddleware, _planController.del);
planRouter.route("/create", _middleware.protectMiddleware).get(_planController.getCreatePlan).post(_planController.postCreatePlan); //초대장 수락 / 거절
// planRouter.get("/:id([0-9a-f]{24})/accept", accept);
// planRouter.get("/:id([0-9a-f]{24})/refuse", refuse);

planRouter.get("/:id([0-9a-f]{24})/:tid/accept", _planController.accept);
planRouter.get("/:id([0-9a-f]{24})/:tid/refuse", _planController.refuse);
var _default = planRouter;
exports["default"] = _default;