import type { WorkspaceError, WorkspaceErrorCode } from "./workspace.types";

const ERROR_MESSAGES: Record<WorkspaceErrorCode, string> = {
  WORKSPACE_NOT_FOUND: "Không tìm thấy Workspace.",
  WORKSPACE_ALREADY_EXISTS: "Personal Workspace đã tồn tại.",
  WORKSPACE_ACCESS_DENIED: "Bạn không có quyền truy cập Workspace này.",
  WORKSPACE_INITIALIZATION_FAILED: "Không thể khởi tạo Workspace.",
  WORKSPACE_INVALID_OWNER: "Danh tính chủ sở hữu Workspace không hợp lệ.",
  WORKSPACE_INVALID_NAME: "Workspace name is required and must be 80 characters or fewer.",
  PROJECT_NOT_FOUND: "Không tìm thấy Project.",
  PROJECT_ACCESS_DENIED: "Bạn không có quyền truy cập Project này.",
  PROJECT_INVALID_NAME: "Tên Project không hợp lệ.",
  PROJECT_INVALID_INPUT: "Dữ liệu Project không hợp lệ.",
  PROJECT_CREATION_FAILED: "Không thể tạo Project.",
  PROJECT_UPDATE_FAILED: "Không thể cập nhật Project.",
  WORKSPACE_PROVIDER_ERROR: "Lỗi khi truy cập tầng lưu trữ Workspace/Project.",
  WORKSPACE_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định.",
  WORKSPACE_UNAUTHENTICATED: "Bạn cần đăng nhập để tiếp tục."
};

export function createWorkspaceError(code: WorkspaceErrorCode): WorkspaceError {
  return { code, message: ERROR_MESSAGES[code] };
}
