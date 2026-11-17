import type {
  MilestoneErrorCode
} from "./milestone.types";

const ERROR_MESSAGES: Record<MilestoneErrorCode, string> = {
  MILESTONE_NOT_FOUND: "Không tìm thấy Milestone.",
  MILESTONE_ACCESS_DENIED: "Bạn không có quyền truy cập Milestone này.",
  MILESTONE_UNAUTHENTICATED: "Bạn cần đăng nhập để tiếp tục.",
  MILESTONE_INVALID_TITLE: "Tiêu đề Milestone không hợp lệ.",
  MILESTONE_INVALID_INPUT: "Dữ liệu Milestone không hợp lệ.",
  MILESTONE_GOAL_NOT_FOUND: "Không tìm thấy Goal sở hữu Milestone.",
  MILESTONE_GOAL_ACCESS_DENIED: "Bạn không có quyền truy cập Goal này.",
  MILESTONE_GOAL_INVALID: "Goal không hợp lệ để tạo Milestone.",
  MILESTONE_ACTION_NOT_FOUND: "Không tìm thấy Action liên quan.",
  MILESTONE_ACTION_RELATION_INVALID: "Quan hệ Milestone–Action không hợp lệ.",
  MILESTONE_ALREADY_COMPLETED: "Milestone đã được hoàn thành.",
  MILESTONE_COMPLETION_NOT_ALLOWED: "Không được phép hoàn thành Milestone.",
  MILESTONE_UPDATE_NOT_ALLOWED: "Không được phép cập nhật Milestone.",
  MILESTONE_PERSISTENCE_ERROR: "Không thể lưu hoặc truy xuất Milestone.",
  MILESTONE_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định."
};

export function createMilestoneError(code: MilestoneErrorCode) {
  return { code, message: ERROR_MESSAGES[code] };
}
