import type { ActionErrorCode } from "./action.types";

const MESSAGES: Record<ActionErrorCode, string> = {
  ACTION_NOT_FOUND: "Không tìm thấy Action.",
  ACTION_ACCESS_DENIED: "Bạn không có quyền truy cập Action này.",
  ACTION_UNAUTHENTICATED: "Bạn cần đăng nhập để tiếp tục.",
  ACTION_INVALID_TITLE: "Tiêu đề Action không hợp lệ.",
  ACTION_INVALID_INPUT: "Dữ liệu Action không hợp lệ.",
  ACTION_INVALID_STATUS: "Trạng thái Action không hợp lệ.",
  ACTION_INVALID_STATUS_TRANSITION: "Không thể chuyển sang trạng thái này.",
  ACTION_ALREADY_COMPLETED: "Action đã hoàn thành.",
  ACTION_COMPLETION_NOT_ALLOWED: "Không được phép hoàn thành Action.",
  ACTION_UPDATE_NOT_ALLOWED: "Không được phép cập nhật Action.",
  ACTION_ARCHIVE_NOT_ALLOWED: "Chức năng archive chưa được cấu hình theo chính sách đã duyệt.",
  ACTION_DELETE_NOT_ALLOWED: "Chức năng delete chưa được cấu hình theo chính sách đã duyệt.",
  ACTION_GOAL_NOT_FOUND: "Không tìm thấy Goal liên quan.",
  ACTION_GOAL_ACCESS_DENIED: "Không có quyền truy cập Goal liên quan.",
  ACTION_MILESTONE_NOT_FOUND: "Không tìm thấy Milestone liên quan.",
  ACTION_MILESTONE_ACCESS_DENIED: "Không có quyền truy cập Milestone liên quan.",
  ACTION_INVALID_ASSOCIATION: "Quan hệ Goal–Milestone–Action không hợp lệ.",
  ACTION_INVALID_EXECUTION_DATA: "Dữ liệu thực thi không hợp lệ.",
  ACTION_INVALID_TIME_RANGE: "Khoảng thời gian thực thi không hợp lệ.",
  ACTION_PERSISTENCE_ERROR: "Không thể lưu hoặc truy xuất Action.",
  ACTION_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định."
};

export function createActionError(code: ActionErrorCode) {
  return { code, message: MESSAGES[code] };
}
