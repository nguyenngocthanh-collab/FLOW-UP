import type { GoalError, GoalErrorCode } from "./goal.types";

const ERROR_MESSAGES: Record<GoalErrorCode, string> = {
  GOAL_NOT_FOUND: "Không tìm thấy Goal.",
  GOAL_ACCESS_DENIED: "Bạn không có quyền truy cập Goal này.",
  GOAL_UNAUTHENTICATED: "Bạn cần đăng nhập để tiếp tục.",
  GOAL_INVALID_TITLE: "Tiêu đề Goal không hợp lệ.",
  GOAL_INVALID_INPUT: "Dữ liệu Goal không hợp lệ.",
  GOAL_PARENT_NOT_FOUND: "Không tìm thấy Parent Goal.",
  GOAL_PARENT_INVALID: "Quan hệ Parent–Child không hợp lệ.",
  GOAL_CIRCULAR_REFERENCE: "Thao tác sẽ tạo circular reference.",
  GOAL_INVALID_HIERARCHY: "Cấu trúc Goal hierarchy không hợp lệ.",
  GOAL_INVALID_PLACEMENT: "Vị trí Goal không hợp lệ.",
  GOAL_OWNERSHIP_MISMATCH: "Ownership của các Goal không khớp.",
  GOAL_PERSISTENCE_ERROR: "Không thể lưu hoặc truy xuất Goal.",
  GOAL_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định."
};

export function createGoalError(code: GoalErrorCode): GoalError {
  return { code, message: ERROR_MESSAGES[code] };
}
