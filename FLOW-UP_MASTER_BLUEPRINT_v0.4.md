# FLOW-UP MASTER BLUEPRINT

**ID:** FEB-000  
**Version:** 0.4  
**Status:** APPROVED — PRODUCT BASELINE & MVP SCOPE; DETAILED DESIGN FRAMEWORK ESTABLISHED  
**Owner:** Product Owner / Technical Lead  
**Last reviewed:** 2026-11-16  
**Purpose:** Single source of truth for FLOW-UP product architecture, MVP scope, detailed technical specifications, development assignments, and implementation sessions.

---

## TABLE OF CONTENTS

- [0. How to Use This Blueprint](#0-how-to-use-this-blueprint)
- [1. L0 — Product Architecture](#1-l0--product-architecture)
- [2. Product Model and Core Domain](#2-product-model-and-core-domain)
- [3. L1 — High-Level System Architecture](#3-l1--high-level-system-architecture)
- [4. L2 — Module Architecture](#4-l2--module-architecture)
- [5. MVP Scope and Priority](#5-mvp-scope-and-priority)
- [6. Core User Journeys](#6-core-user-journeys)
- [7. High-Level Dependency Map](#7-high-level-dependency-map)
- [8. MVP Acceptance Criteria](#8-mvp-acceptance-criteria)
- [9. Function Specification Standard](#9-function-specification-standard)
- [10. Development Board](#10-development-board)
- [11. Development Session Management](#11-development-session-management)
- [12. Decision Register](#12-decision-register)
- [13. MVP Build Order](#13-mvp-build-order)
- [14. Future Scope Register](#14-future-scope-register)
- [15. Open Architecture Questions](#15-open-architecture-questions)
- [16. Change Log](#16-change-log)
- [17. Current Architecture and Development State](#17-current-architecture-and-development-state)
- [18. UI/UX Foundation Principles](#18-uiux-foundation-principles)
- [19. Ready-to-Code Part Specification Contract](#19-ready-to-code-part-specification-contract)
- [20. New-Chat Handoff Protocol](#20-new-chat-handoff-protocol)
- [21. Friend Design Integration Notes](#21-friend-design-integration-notes)

---

# 0. HOW TO USE THIS BLUEPRINT

This document is the single source of truth for FLOW-UP architecture and development management.

All architecture decisions, module specifications, implementation tasks, development sessions, verification results, and approved changes must be maintained in this file. Do not create parallel architecture or project-management Markdown files unless the Product Owner explicitly approves an exception.

## 0.1 Architecture levels

- **L0 — Product:** Product vision, user value, core loop, MVP boundaries.
- **L1 — System Areas:** Major technical areas and their responsibilities.
- **L2 — Modules:** Functional modules, ownership, dependencies, and boundaries.
- **L3 — Components and Functions:** UI components, use cases, services, and operations.
- **L4 — Implementation Specifications:** Data contracts, algorithms, APIs, validation, errors, tests, and implementation details.
- **L5 — Development Tasks and Sessions:** Assignments, implementation progress, test results, and handoffs.

The architecture tree defines what must be built and how parts are organized. Detailed implementation specifications are completed progressively, before the affected work is implemented.

## 0.2 Status rules

Architecture and development status must not be confused.

**Architecture status**
- `NOT_STARTED`: not designed yet.
- `PROPOSED`: initial design exists but is not approved.
- `IN_REVIEW`: awaiting review.
- `APPROVED`: design is approved.
- `IMPLEMENTED`: implementation exists.
- `VERIFIED`: implementation passed its acceptance criteria.
- `DEPRECATED`: no longer current; retained for history.

**Development status**
- `AVAILABLE`: design and dependencies are ready.
- `CLAIMED`: assigned to a developer.
- `IN_PROGRESS`: implementation has started.
- `BLOCKED`: waiting for a decision or dependency.
- `REVIEW`: awaiting code review.
- `IN_TEST`: undergoing verification.
- `DONE`: acceptance criteria passed and work integrated.

A section being `APPROVED` does not mean it has been implemented.

## 0.3 Development rules

1. Do not implement a function before its required specification is approved.
2. Do not invent missing business rules, data contracts, or shared interfaces.
3. Every module must have an explicit responsibility and boundary.
4. Every cross-module interaction must follow an agreed contract.
5. A change affecting another module must have its impact assessed and recorded here.
6. Every completed function must pass its acceptance criteria and relevant tests.
7. Keep the MVP small. Future Scope must not become a hidden implementation requirement.
8. Update this file when decisions, specifications, task status, session results, or architecture change.
9. Use the smallest sufficient design. Do not over-engineer future capabilities before the MVP needs them.
10. When a decision is not yet made, mark it `OPEN`; do not silently treat a recommendation as approved.

## 0.4 Change management

For every material architecture change, record:
- What is changing and why.
- Which modules, entities, APIs, screens, and tests are affected.
- Whether existing data requires migration.
- Whether the change alters MVP scope.
- The decision status and approval.

---

# 1. L0 — PRODUCT ARCHITECTURE

## 1.1 Product

**FLOW-UP** is a personal goal execution and progress management platform that helps users turn desired outcomes into clear goals, practical plans, executable actions, and measurable progress.

FLOW-UP is not only a task manager. Its central value is helping users who may not know how to reach a goal understand what to do, organize the work, execute it, and learn from their results.

## 1.2 Product vision

Help a person move from:

> "I want to achieve something, but I do not know where to start."

to:

> "I understand what I need to do, I have a realistic plan, and I can see whether I am making progress."

## 1.3 Core product loop

`Define Goal → Understand → Break Down → Plan → Execute → Measure → Review → Adjust`

The loop must be supported by connected product capabilities rather than isolated features.

## 1.4 Core product principles

1. **Outcome-first:** Start from the result the user wants to achieve.
2. **Clarity before execution:** Help the user understand an unclear or broad goal.
3. **Action-oriented:** Turn goals into concrete work that can be performed.
4. **AI-assisted:** Use AI to help users reason about goals and construct plans.
5. **User-controlled:** AI proposes; the user reviews and decides.
6. **Measurable:** Support meaningful measurement of results and progress.
7. **Time-aware:** Allow optional deadlines and time-based planning.
8. **Feedback-oriented:** Compare intended plans with actual execution.
9. **Evidence-led:** Progress and review should use recorded system data where possible.
10. **Progressive complexity:** Present a useful overview first and reveal deeper structure when needed.
11. **Single source of truth:** Each business fact has one authoritative owner. Screens, calendars, summaries, and widgets display or derive data from that owner rather than maintaining competing copies.
12. **Consistent information routing:** A change made through one valid interface must be reflected in every relevant view through shared application/domain data and query invalidation or refresh. Do not build point-to-point synchronization between screens.
13. **Overview before detail:** The default experience emphasizes the desired outcome, current state, next meaningful checkpoint, and next executable action. Deeper hierarchy and supporting information are revealed on demand.
14. **Composable interface foundation:** UI must be built from reusable layout primitives, design tokens, and predictable interaction patterns so visual quality can improve without rewriting domain logic.


## 1.5 MVP objective

Deliver a publicly accessible web application with persistent, user-specific data and one complete personal workflow:

1. Register or sign in.
2. Access a personal workspace.
3. Create a standalone Goal or a Project.
4. Create Goals inside a Project when appropriate.
5. Use AI to clarify a Goal and propose a structured breakdown.
6. Review and approve or edit the AI proposal.
7. Organize Goals, Milestones, Actions, and Measurements.
8. Create a plan manually or request a basic AI-generated Daily Plan.
9. Schedule and execute Actions.
10. Record measurements and actual results.
11. View progress and review planned versus actual execution.

## 1.6 MVP completion condition

A user can complete the core journey in the deployed web application without manually editing the database or relying on mock data.

- User data persists after refresh and subsequent login.
- Each user can access only their own authorized data.
- AI-generated content is validated and does not become official data until the user approves it.
- The user can create and execute a plan without AI.
- The core workflow remains usable if the AI provider is temporarily unavailable.

---

# 2. PRODUCT MODEL AND CORE DOMAIN

## 2.1 Target user and release direction

**MVP:** Single-person use. Each account manages its own personal workspace and data.

**Future direction:** Team workspaces and collaboration may be added later. Team membership, roles, permissions, and collaboration workflows are not MVP requirements.

## 2.2 Workspace model

Each User has one Personal Workspace in the MVP.

A Personal Workspace can contain:
- Independent Goals.
- Multiple Projects.

The Workspace is the user's personal container and ownership boundary.

## 2.3 Project model

A Project is an optional organizational container for a collection of related Goals.

A Project is useful when a user wants to manage a larger initiative, such as developing an application.

A Project is not required for every Goal.

## 2.4 Goal model

A Goal represents an outcome the user wants to achieve.

A Goal can:
- Exist independently in the Personal Workspace.
- Belong to a Project.
- Contain child Goals.
- Have one or more Milestones.
- Have Measurement definitions and records.
- Have an optional target date or expected completion period.
- Be moved between the independent Workspace area and a Project.

Moving a Goal must preserve its identity, descendants, associated Milestones, Actions, Measurements, history, and other valid relationships. Moving must not duplicate the Goal or silently discard related data.

The exact movement rules and transactional behavior must be specified in the Goal Management design.

## 2.5 Goal hierarchy

Goal decomposition is flexible and is not restricted to a fixed number of levels.

The system must support:
- A clear top-level Goal.
- Child Goals where further decomposition is useful.
- A compact overview that communicates the overall outcome and current state.
- Expansion into deeper levels when the user wants detail.

The UI must not force users to inspect every node to understand what matters next.

## 2.6 Milestone model

A Milestone represents an important checkpoint in the progress of a Goal.

A Milestone is conceptually different from a Goal:
- Goal describes an outcome to achieve.
- Milestone describes a checkpoint on the way to that outcome.
- Action describes work that a user performs.

A Goal may have zero or more Milestones. A Milestone is associated with its owning Goal.

## 2.7 Action model

An Action is a concrete unit of work that can be planned and executed.

Actions are execution-level items and are not further decomposed into Goal nodes in the MVP.

An Action must be associated with a relevant Goal or Milestone through explicitly defined relationship rules. Exact cardinality is an open technical decision.

## 2.8 Measurement model

A Measurement describes how an aspect of a Goal's result is evaluated.

Example: an IELTS Goal may track Overall, Listening, Reading, Writing, and Speaking scores.

Measurement definitions and recorded values must be distinguishable. The exact cardinality, supported value types, target rules, and history model remain open for detailed Domain Model design.

## 2.9 Schedule and Daily Plan model

A Schedule represents planned time for an Action.

A Daily Plan is the user's plan for a particular day, assembled from scheduled Actions.

Manual Planning and AI-assisted Planning must use the same underlying Planning and Schedule model.

Exact cardinality, recurrence, time-zone handling, and conflict rules remain open for detailed design.

## 2.10 Review model

Review compares planned work with actual execution and recorded results.

The MVP supports a basic review workflow. Advanced coaching, automated diagnosis, and autonomous plan adjustment are deferred.

---

# 3. L1 — HIGH-LEVEL SYSTEM ARCHITECTURE

FLOW-UP is divided into six system areas.

```text
FLOW-UP
│
├── A. WEB CLIENT
│   └── User interface and interaction
│
├── B. APPLICATION / BACKEND
│   └── Use cases, business workflows, and trusted operations
│
├── C. DOMAIN
│   └── Business entities, rules, and invariants
│
├── D. DATA & INFRASTRUCTURE
│   └── Persistence, authentication, AI provider, and shared mechanisms
│
├── E. AI CAPABILITY
│   └── Goal understanding, proposal generation, and planning assistance
│
└── F. DELIVERY & QUALITY
    └── Build, testing, integration, deployment, and operation
```

## A. WEB CLIENT

Responsible for displaying product information and receiving user interactions.

The client presents the Goal Overview, Goal Tree, Project views, Action workflows, Planning, Calendar, Progress, Review, and AI-assisted experiences.

The client must not be the authority for security-sensitive checks or business invariants.

## B. APPLICATION / BACKEND

Responsible for application use cases and trusted business operations.

It coordinates domain operations, persistence, authorization checks, AI proposal workflows, and cross-module operations.

## C. DOMAIN

Responsible for the meaning and rules of FLOW-UP data.

It defines entities, relationships, invariants, status transitions, and calculation rules independently from UI presentation.

## D. DATA & INFRASTRUCTURE

Responsible for persistent storage, authentication integration, shared contracts, validation mechanisms, error handling, logging, and external service integration.

The selected database and providers will be confirmed in the Technology Decision section before implementation.

## E. AI CAPABILITY

Responsible for AI-assisted goal clarification, feasibility feedback, Goal Tree proposals, and basic Daily Plan proposals.

AI output is untrusted proposal data until validated and approved by the user.

AI must not bypass application/domain rules or directly write unapproved business data.

## F. DELIVERY & QUALITY

Responsible for repository workflow, automated checks, tests, deployment, environment configuration, and production verification.

---

# 4. L2 — MODULE ARCHITECTURE

This section defines the initial module map. Detailed responsibilities, contracts, data ownership, and function specifications are completed in later design work.

## A. WEB CLIENT

```text
WEB CLIENT
│
├── A01. Application Shell & Authentication UI
├── A02. Workspace & Project Interface
├── A03. Goal Overview & Goal Tree Interface
├── A04. Milestone Interface
├── A05. Action Interface
├── A06. Measurement Interface
├── A07. Planning Interface
├── A08. Calendar Interface
├── A09. Progress & Review Interface
├── A10. AI Assistant Interface
└── A11. Shared UI Components
```

### A01. Application Shell & Authentication UI

Initial responsibilities:
- Application initialization.
- Sign up, sign in, and sign out screens.
- Main layout and navigation.
- Route management.
- Session-aware UI.
- Global loading, empty, and error states.

### A02. Workspace & Project Interface

Initial responsibilities:
- Display the user's Personal Workspace.
- Display independent Goals.
- List and open Projects.
- Create, edit, archive, and open Projects.
- Display Goals belonging to a Project.

### A03. Goal Overview & Goal Tree Interface

Initial responsibilities:
- Display Goal overview and status.
- Display compact progress summary.
- Display Goal hierarchy.
- Create and edit Goals.
- Add child Goals.
- Move a Goal between independent Workspace scope and a Project.
- Expand and collapse Goal Tree branches.
- Display next relevant Milestone or Action.
- Avoid overwhelming the user with excessive hierarchy by default.

Views:
- Goal Overview.
- List / Outline.
- Goal Tree.

### A04. Milestone Interface

Initial responsibilities:
- Create and edit Milestones.
- Display Milestones under a Goal.
- Update Milestone status.
- Display associated Actions where supported by the approved relationship model.

### A05. Action Interface

Initial responsibilities:
- Display Actions.
- Create, edit, and archive/delete Actions according to approved rules.
- Associate Action with Goal or Milestone.
- Update Action status.
- Mark Action complete.
- Record actual execution information where required.

### A06. Measurement Interface

Initial responsibilities:
- Define Measurement label and unit.
- Define target value where applicable.
- Display current value.
- Record measurement updates.
- Display measurement history.

### A07. Planning Interface

Initial responsibilities:
- Display a Daily Plan.
- Add or remove Actions from a plan.
- Set planned date and duration.
- Support manual planning.
- Display AI-proposed Daily Plan.
- Allow users to edit, accept, or reject a proposal.

### A08. Calendar Interface

Initial responsibilities:
- Display scheduled Actions.
- Provide a date-oriented entry point to inspect and manage planned work.
- Allow supported calendar interactions to open or edit the underlying Action/Schedule through the normal application workflow.
- Reflect updates made from Goal, Action, or Planning views without maintaining a separate copy of business data.
- Provide a basic calendar view suitable for the MVP.
- Open a scheduled Action.
- Create, edit, or remove schedule information.

Month / Week / Day view selection is subject to MVP feasibility and must not delay the core Planning workflow.

### A09. Progress & Review Interface

Initial responsibilities:
- Display Goal progress.
- Display Action completion.
- Display Measurement values and history.
- Compare planned and actual execution.
- Record optional review notes.
- Display a concise review summary.

### A10. AI Assistant Interface

Initial responsibilities:
- Capture a user's initial Goal description.
- Display clarification questions.
- Display AI reasoning summary, assumptions, and caveats.
- Display proposed Goal Tree.
- Support accepting, rejecting, or editing proposal items.
- Display AI Daily Plan proposals.
- Clearly distinguish proposal data from saved data.

### A11. Shared UI Components

Initial responsibilities:
- Form controls.
- Dialogs and popups.
- Buttons.
- Navigation elements.
- Status indicators.
- Loading states.
- Empty states.
- Error messages.
- Reusable layout components.

## B. APPLICATION / BACKEND

```text
APPLICATION / BACKEND
│
├── B01. Authentication & User Context
├── B02. Workspace & Project Management
├── B03. Goal Management
├── B04. Milestone Management
├── B05. Action Management
├── B06. Measurement Management
├── B07. Planning & Scheduling
├── B08. Progress Engine
├── B09. Review Management
└── B10. AI Orchestration
```

### B01. Authentication & User Context

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE  
**Development Status:** AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

#### 1. Purpose

B01 chịu trách nhiệm quản lý xác thực người dùng cơ bản và cung cấp thông tin người dùng hiện tại cho toàn bộ ứng dụng FLOW-UP.

Mục tiêu là cho phép người dùng đăng ký, đăng nhập, duy trì trạng thái đăng nhập và sử dụng dữ liệu cá nhân một cách an toàn.

B01 chỉ triển khai những chức năng cần thiết cho MVP. Không xây dựng một hệ thống Authentication độc lập hoặc các cơ chế quản lý tài khoản nâng cao.

#### 2. MVP Scope

**Included:**

- User Registration.
- User Login.
- User Logout.
- Basic Session Management.
- Session Restoration after page refresh.
- Current User Resolution.
- Internal User Identity Mapping.
- Basic Authentication Error Handling.
- User-specific Data Access.

**Excluded:**

- Google/GitHub Social Login.
- Multi-factor Authentication (MFA).
- Multiple Authentication Providers.
- Enterprise SSO.
- Advanced Session Management.
- Device Management.
- Advanced Account Recovery.
- Complex Role-based Access Control.
- Team Account and Membership Management.
- Subscription and Billing.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm thực sự có nhu cầu.

#### 3. Authentication Method

**Approved Method: Email / Password**

Người dùng có thể:

- Đăng ký bằng email và mật khẩu.
- Đăng nhập bằng email và mật khẩu.
- Đăng xuất khỏi tài khoản hiện tại.

**Rules:**

- Sử dụng Authentication Provider có sẵn thay vì tự xây dựng hệ thống xác thực.
- Không lưu plaintext password trong database của FLOW-UP.
- Không tự triển khai password hashing hoặc password management nếu provider đã hỗ trợ.
- Mật khẩu phải đáp ứng yêu cầu của provider được lựa chọn.
- Email verification sử dụng khả năng mặc định của provider nếu có; không xây dựng quy trình xác minh email riêng trong MVP.

Authentication Provider cụ thể được lựa chọn và tích hợp trong D02.

#### 4. Core Functions

##### B01.1. User Registration

**Purpose:** Tạo tài khoản mới.

**Input:**

- Email.
- Password.

**Processing:**

1. Người dùng nhập email và password.
2. Validate dữ liệu đầu vào.
3. Gửi yêu cầu đăng ký đến Authentication Provider.
4. Xử lý kết quả đăng ký.
5. Tạo hoặc liên kết Internal User Identity.
6. Khởi tạo Personal Workspace thông qua B02 khi tài khoản đủ điều kiện sử dụng ứng dụng.
7. Trả kết quả đăng ký cho frontend.

**Expected Results:**

- Registration successful.
- Email already registered.
- Invalid email.
- Invalid password.
- Email verification required (nếu provider yêu cầu).
- Authentication provider error.

**Rules:**

- Không tạo trùng Internal User.
- Không tạo trùng Personal Workspace.
- Đăng ký thành công không mặc định có nghĩa là người dùng đã đăng nhập.
- Có thể thử lại thao tác khởi tạo Workspace mà không tạo dữ liệu trùng lặp.

##### B01.2. User Login

**Purpose:** Xác thực người dùng.

**Input:**

- Email.
- Password.

**Processing:**

1. Người dùng nhập thông tin đăng nhập.
2. Validate input.
3. Gửi yêu cầu đăng nhập đến Authentication Provider.
4. Nhận kết quả xác thực.
5. Resolve Internal User Identity.
6. Thiết lập hoặc khôi phục session.
7. Trả kết quả đăng nhập cho frontend.

**Expected Results:**

- Login successful.
- Invalid credentials.
- Email verification required (nếu provider yêu cầu).
- Account unavailable.
- Provider error.

**Rules:**

- Chỉ đăng nhập thành công khi provider xác nhận thông tin hợp lệ.
- Không tự tạo tài khoản mới trong quá trình đăng nhập.
- Không tiết lộ thông tin tài khoản không cần thiết thông qua thông báo lỗi.

##### B01.3. User Logout

**Purpose:** Kết thúc phiên đăng nhập hiện tại.

**Processing:**

1. Gửi yêu cầu logout đến Authentication Provider.
2. Kết thúc session theo cơ chế của provider.
3. Xóa trạng thái authenticated trong frontend.
4. Chuyển người dùng về màn hình đăng nhập.

**Rules:**

- Sau khi logout, người dùng không được tiếp tục truy cập chức năng yêu cầu đăng nhập.
- Có thể xử lý an toàn khi người dùng logout nhiều lần.

##### B01.4. Session Management

**Purpose:** Duy trì trạng thái đăng nhập cơ bản.

**Required Capabilities:**

- Kiểm tra session khi ứng dụng khởi động.
- Duy trì session sau khi tải lại trang.
- Nhận biết session hết hạn.
- Khôi phục session khi provider hỗ trợ.
- Kết thúc session khi logout.

**Authentication States:**

| State | Meaning |
|---|---|
| `UNKNOWN` | Chưa xác định trạng thái đăng nhập |
| `AUTHENTICATED` | Người dùng đã đăng nhập |
| `UNAUTHENTICATED` | Người dùng chưa đăng nhập |
| `SESSION_EXPIRED` | Session đã hết hạn |

**Rules:**

- Trạng thái ban đầu khi mở ứng dụng là `UNKNOWN`.
- Không hiển thị dữ liệu cá nhân trước khi xác định trạng thái đăng nhập.
- Chỉ chuyển sang `AUTHENTICATED` sau khi xác thực session thành công.
- Khi session hết hạn, yêu cầu đăng nhập lại nếu không thể khôi phục.
- Sử dụng session mechanism mặc định của Authentication Provider.
- Không tự xây dựng hệ thống quản lý session phức tạp.

#### 5. Internal User Identity

**Purpose:** Cung cấp định danh nội bộ thống nhất cho toàn bộ FLOW-UP.

FLOW-UP sử dụng Internal User ID để liên kết dữ liệu của người dùng.

**Logical Data Model:**

**User**

| Field | Description |
|---|---|
| `id` | Internal User ID |
| `email` | Email của người dùng |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |

**UserIdentity**

| Field | Description |
|---|---|
| `id` | Identity mapping ID |
| `user_id` | Internal User ID |
| `provider` | Authentication Provider |
| `provider_user_id` | ID do provider cấp |

**Rules:**

- Internal User ID là định danh chính được sử dụng trong FLOW-UP.
- Provider User ID chỉ dùng để liên kết tài khoản với Authentication Provider.
- Không sử dụng Provider User ID thay cho Internal User ID trong các module nghiệp vụ.
- Không tự động hợp nhất hai tài khoản chỉ vì email giống nhau.
- MVP chỉ hỗ trợ một authentication identity cho mỗi Internal User.

D01 chịu trách nhiệm thiết kế schema, constraints và persistence cho các dữ liệu này.

#### 6. Current User Context

**Purpose:** Cung cấp thông tin người dùng hiện tại cho các module nghiệp vụ.

**Logical User Context:**

| Field | Description |
|---|---|
| `user_id` | Internal User ID |
| `email` | Email người dùng |
| `authenticated` | Trạng thái xác thực |

**Rules:**

- Chỉ tạo User Context sau khi session được xác thực.
- `user_id` phải được lấy từ identity mapping đáng tin cậy.
- Không tin tưởng `user_id` do frontend tự gửi lên.
- Các module nghiệp vụ chỉ cần sử dụng Internal User ID.
- Không để các module nghiệp vụ phụ thuộc trực tiếp vào Authentication Provider.

**Consumers:**

- B02 Workspace & Project Management.
- B03 Goal Management.
- B04 Milestone Management.
- B05 Action Management.
- B06 Measurement Management.
- B07 Planning & Scheduling.
- B08 Progress Engine.
- B09 Review Management.
- B10 AI Orchestration.

#### 7. Basic Data Access Protection

B01 cung cấp thông tin xác thực để các module nghiệp vụ kiểm tra quyền truy cập dữ liệu.

**MVP Rules:**

1. Người dùng phải đăng nhập để sử dụng các chức năng cá nhân.
2. Mọi truy vấn dữ liệu cá nhân phải sử dụng Internal User ID đã được xác thực.
3. Người dùng chỉ được truy cập dữ liệu thuộc quyền sở hữu của mình.
4. Không sử dụng User ID do frontend cung cấp làm căn cứ duy nhất để xác định quyền truy cập.
5. Backend phải kiểm tra quyền sở hữu dữ liệu trước khi thực hiện thao tác.

Mỗi module nghiệp vụ chịu trách nhiệm kiểm tra quyền truy cập đối với dữ liệu mà module đó quản lý.

B01 không xây dựng một hệ thống phân quyền phức tạp trong MVP.

#### 8. Application Operations

B01 cung cấp các thao tác logic sau:

| Operation | Purpose |
|---|---|
| `register(email, password)` | Đăng ký tài khoản |
| `login(email, password)` | Đăng nhập |
| `logout()` | Đăng xuất |
| `getCurrentSession()` | Lấy trạng thái session |
| `getCurrentUser()` | Lấy người dùng hiện tại |
| `requireAuthenticatedUser()` | Yêu cầu người dùng đã xác thực |

Đây là các thao tác ở cấp kiến trúc, chưa phải HTTP endpoint cuối cùng.

Chi tiết implementation phụ thuộc vào backend framework và Authentication Provider được chọn.

#### 9. Error Handling

B01 cần xử lý các lỗi cơ bản:

| Error Code | Meaning |
|---|---|
| `AUTH_INVALID_CREDENTIALS` | Email hoặc password không hợp lệ |
| `AUTH_EMAIL_ALREADY_EXISTS` | Email đã được đăng ký |
| `AUTH_INVALID_EMAIL` | Email không hợp lệ |
| `AUTH_INVALID_PASSWORD` | Password không hợp lệ |
| `AUTH_EMAIL_VERIFICATION_REQUIRED` | Cần xác minh email |
| `AUTH_SESSION_EXPIRED` | Session hết hạn |
| `AUTH_UNAUTHENTICATED` | Chưa đăng nhập |
| `AUTH_PROVIDER_UNAVAILABLE` | Authentication Provider không khả dụng |
| `AUTH_UNKNOWN_ERROR` | Lỗi không xác định |

**Rules:**

- Không trả trực tiếp lỗi nội bộ của provider cho frontend.
- Sử dụng quy ước error response chung của D06.
- Không ghi password hoặc session secrets vào log.

#### 10. Dependencies

| Dependency | Purpose |
|---|---|
| D01 Database & Persistence | Lưu Internal User và identity mapping |
| D02 Authentication Integration | Kết nối Authentication Provider |
| D03 Shared Types & Contracts | Các kiểu dữ liệu dùng chung |
| D04 Validation | Kiểm tra input |
| D06 Error Handling | Chuẩn hóa lỗi |
| D08 Security & Configuration | Cấu hình session và secrets |
| B02 Workspace & Project Management | Khởi tạo Personal Workspace |

**Integration Rules:**

- B01 sử dụng D02 để thực hiện xác thực.
- B01 sử dụng D01 để liên kết Internal User Identity.
- B01 cung cấp User Context cho các module nghiệp vụ.
- B01 gọi B02 để khởi tạo Personal Workspace khi cần.
- Không tạo logic Authentication riêng trong từng business module.

#### 11. Security Requirements

MVP chỉ yêu cầu các biện pháp cơ bản nhưng bắt buộc:

- Không lưu plaintext password.
- Không để lộ Authentication Provider secrets ở frontend.
- Sử dụng session mechanism an toàn do provider hỗ trợ.
- Backend phải xác thực người dùng trước khi truy cập dữ liệu cá nhân.
- Không tin tưởng User ID do frontend tự gửi.
- Kiểm tra quyền sở hữu dữ liệu ở backend.
- Không ghi password hoặc session secrets vào log.

Không tự xây dựng các cơ chế bảo mật nâng cao khi provider đã cung cấp giải pháp phù hợp.

#### 12. Acceptance Criteria

B01 được xem là đạt yêu cầu MVP khi:

**Registration**

- [ ] Người dùng đăng ký được bằng Email / Password.
- [ ] Email không hợp lệ bị từ chối.
- [ ] Password không hợp lệ bị từ chối.
- [ ] Email đã đăng ký được xử lý đúng.
- [ ] Không lưu plaintext password.
- [ ] Không tạo trùng Internal User.
- [ ] Personal Workspace được khởi tạo đúng một lần.

**Login**

- [ ] Người dùng đăng nhập được bằng thông tin hợp lệ.
- [ ] Thông tin không hợp lệ bị từ chối.
- [ ] Hệ thống resolve đúng Internal User ID.
- [ ] Session được thiết lập sau khi đăng nhập thành công.

**Session and Logout**

- [ ] Người dùng duy trì đăng nhập sau page refresh.
- [ ] Session hết hạn được xử lý đúng.
- [ ] Người dùng đăng xuất được.
- [ ] Sau logout không thể tiếp tục truy cập chức năng yêu cầu đăng nhập.

**User Context and Data Protection**

- [ ] Hệ thống xác định được người dùng hiện tại.
- [ ] Các module nghiệp vụ nhận được Internal User ID.
- [ ] Người dùng không thể truy cập dữ liệu của tài khoản khác.
- [ ] Backend không tin tưởng User ID do frontend tự gửi.

#### 13. Testing Requirements

**Unit Tests**

- Registration input validation.
- Login input validation.
- Internal User Identity mapping.
- Current User Context resolution.
- Authentication state handling.

**Integration Tests**

- Registration with Authentication Provider.
- Login with Authentication Provider.
- Logout with Authentication Provider.
- Session restoration.
- Session expiration.
- Internal User persistence.
- Personal Workspace initialization.

**Security Tests**

- Unauthenticated request.
- Invalid session.
- Expired session.
- Forged client-provided User ID.
- Cross-user data access attempt.

**End-to-End Tests**

1. Register → Create Personal Workspace → Logout.
2. Login → Access Workspace → Refresh page → Continue session.
3. Login → Logout → Attempt protected access → Rejected.
4. User A → Attempt to access User B's data → Rejected.

#### 14. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Chốt Authentication Provider | D02 |
| 2 | Chuẩn bị Internal User schema | D01 |
| 3 | Implement đăng ký | D02, D01 |
| 4 | Implement đăng nhập | D02, D01 |
| 5 | Implement session restoration | D02 |
| 6 | Implement đăng xuất | D02 |
| 7 | Implement Current User Context | D01, D02 |
| 8 | Integrate Personal Workspace initialization | B02 |
| 9 | Implement data ownership checks | Business modules |
| 10 | Run integration and security tests | All required dependencies |

Triển khai theo từng bước nhỏ. Không cần xây dựng thêm abstraction hoặc infrastructure không phục vụ trực tiếp phạm vi MVP.

#### 15. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Social Login.
- Multi-factor Authentication.
- Multiple Authentication Providers.
- Enterprise SSO.
- Advanced Account Recovery.
- Device and Session Management.
- Advanced Role and Permission Management.
- Team Authentication.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

#### 16. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Authentication Method | APPROVED — DEC-006 | Email / Password |
| Authentication Scope | APPROVED | Basic MVP Authentication |
| Authentication Provider | OPEN — DEC-020 | To be selected in D02 |
| Internal User ID | APPROVED FOR B01 | Provider-independent ID |
| Identity Mapping | APPROVED FOR B01 | User + UserIdentity |
| Session Strategy | APPROVED FOR MVP | Use provider-supported session mechanism |
| Email Verification | PROVIDER DEFAULT | No custom verification workflow |
| Password Management | PROVIDER RESPONSIBILITY | No custom password storage |
| Social Login | FUTURE SCOPE | Not included |
| MFA | FUTURE SCOPE | Not included |
| Database Technology | OPEN — D01 | Defined in D01 |

#### 17. Ready-to-Code Status

**Specification Status:** READY TO CODE

**Development Status:** AVAILABLE once the selected provider and required persistence interfaces are available.

**Implementation Status:** NOT_STARTED

**Remaining Dependencies:**

- D02: Select and configure Authentication Provider.
- D01: Provide Internal User and UserIdentity persistence.
- D03: Provide shared authentication types.
- D08: Provide required environment and security configuration.
- B02: Provide Personal Workspace initialization operation.

B01 does not require a custom Authentication infrastructure.

The MVP implementation should use the simplest provider-supported solution that satisfies the requirements above.

**Final Implementation Rule:** Build only basic authentication and user-context functionality required by FLOW-UP MVP. Do not introduce advanced authentication features or unnecessary abstractions.
### B02. Workspace & Project Management

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE  
**Development Status:** AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

#### 1. Purpose

B02 chịu trách nhiệm quản lý Personal Workspace và Project của người dùng trong FLOW-UP.

Workspace là không gian làm việc cá nhân, đóng vai trò container gốc chứa dữ liệu nghiệp vụ của một người dùng.

Project là một không gian tổ chức tùy chọn bên trong Workspace, giúp người dùng nhóm các Goal có liên quan đến cùng một sáng kiến hoặc kết quả lớn.

Mục tiêu của B02 là cung cấp nền tảng tổ chức dữ liệu để người dùng có thể:

- Truy cập Personal Workspace của mình.
- Tạo và quản lý các Project.
- Xem tổng quan Workspace.
- Xem tổng quan từng Project.
- Tổ chức Goal độc lập hoặc Goal thuộc Project.
- Truy cập dữ liệu theo đúng quyền sở hữu.

B02 chỉ triển khai các chức năng cần thiết cho MVP.

Không xây dựng hệ thống quản lý tổ chức, nhóm hoặc cộng tác nhiều người trong phạm vi hiện tại.

#### 2. MVP Scope

**Included:**

- Personal Workspace Initialization.
- Retrieve Current User's Workspace.
- Retrieve Workspace Overview.
- Create Project.
- Retrieve Project.
- Update Project.
- List Projects in Workspace.
- Retrieve Project Overview.
- Project Ownership Validation.
- Workspace Ownership Validation.
- Goal Placement Support.
- Basic Workspace and Project Error Handling.
- User-specific Workspace and Project Data Access.

**Excluded:**

- Multiple Personal Workspaces per User.
- Team Workspace.
- Organization Management.
- Team Membership.
- Workspace Invitations.
- Shared Workspace.
- Project Collaboration.
- Role-based Access Control.
- Advanced Permission Management.
- Project Templates.
- Project Duplication.
- Project Import / Export.
- Project-specific Billing.
- Project Analytics beyond basic overview.
- Advanced Project Archiving and Recovery.
- Cross-workspace Project Transfer.
- Custom Workspace Configuration.
- Workspace-level Automation.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm thực sự có nhu cầu.

#### 3. Workspace Model

**Approved Model: Personal Workspace**

Trong MVP, mỗi User có đúng một Personal Workspace.

Workspace là container gốc của dữ liệu cá nhân.

Logical relationship:

`User 1 — 1 Personal Workspace`

`Personal Workspace 1 — N Projects`

`Personal Workspace 1 — N Independent Goals`

`Project 1 — N Goals`

Một Workspace có thể chứa nhiều Project và các Goal độc lập.

Project không bắt buộc phải tồn tại trước khi người dùng tạo Goal.

**Workspace Responsibilities:**

- Đại diện cho không gian làm việc cá nhân.
- Là nguồn xác định phạm vi dữ liệu của người dùng.
- Cung cấp danh sách Project.
- Cung cấp thông tin tổng quan Workspace.
- Là điểm truy cập cho các chức năng quản lý dữ liệu cá nhân.

**Rules:**

- Mỗi Internal User ID chỉ có một Personal Workspace.
- Workspace phải thuộc về một Internal User ID hợp lệ.
- Workspace không được tạo trùng cho cùng một User.
- Không cho phép người dùng truy cập Workspace của tài khoản khác.
- Không sử dụng User ID do frontend gửi lên làm căn cứ duy nhất để xác định ownership.
- Workspace được khởi tạo thông qua B01 khi tài khoản đủ điều kiện sử dụng ứng dụng.
- Workspace initialization phải có tính idempotent.
- Không xây dựng cơ chế tạo nhiều Workspace trong MVP.

#### 4. Project Model

**Purpose:** Cung cấp khả năng tổ chức các Goal có liên quan.

Project là một organizational container nằm trong Personal Workspace.

Project không phải là Goal và không thay thế Goal.

Ví dụ:

- Project: Develop FLOW-UP.
  - Goal: Complete Authentication Module.
  - Goal: Complete Workspace Module.
  - Goal: Complete Goal Management Module.

Người dùng cũng có thể tạo Goal trực tiếp trong Workspace mà không cần tạo Project.

**Project Responsibilities:**

- Nhóm các Goal có liên quan.
- Cung cấp thông tin cơ bản về một sáng kiến.
- Cung cấp tổng quan về các Goal thuộc Project.
- Hỗ trợ truy cập và quản lý Project.
- Duy trì quan hệ hợp lệ giữa Workspace và Project.

**Project Logical Data Model:**

| Field | Description |
|---|---|
| `id` | Internal Project ID |
| `workspace_id` | Workspace sở hữu Project |
| `name` | Tên Project |
| `description` | Mô tả Project, có thể null |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |

Các thuộc tính bổ sung như Project status, deadline, màu sắc và hình ảnh đại diện chưa phải yêu cầu bắt buộc của MVP.

**Rules:**

- Một Project phải thuộc đúng một Workspace.
- Project không được tồn tại độc lập ngoài Workspace.
- Project phải có tên hợp lệ.
- Project chỉ được truy cập bởi người sở hữu Workspace chứa Project.
- Không cho phép chuyển Project sang Workspace của người dùng khác trong MVP.
- Không tự động tạo Goal khi tạo Project.
- Không yêu cầu người dùng phải tạo Project trước khi tạo Goal.
- Project không trực tiếp quản lý logic Goal, Milestone hoặc Action.
- Không giả định rằng Project là một cấp của Goal hierarchy.

#### 5. Core Functions

##### B02.1. Personal Workspace Initialization

**Purpose:** Tạo Personal Workspace cho người dùng khi tài khoản được khởi tạo.

**Trigger:**

- B01 gọi B02 sau khi Internal User được tạo thành công.
- Có thể gọi lại khi cần kiểm tra hoặc khôi phục quá trình initialization.

**Input:**

- Authenticated Internal User ID.

**Processing:**

1. Nhận Internal User ID từ trusted application context.
2. Kiểm tra Internal User có tồn tại và hợp lệ.
3. Kiểm tra Workspace đã tồn tại hay chưa.
4. Nếu đã tồn tại, trả Workspace hiện tại.
5. Nếu chưa tồn tại, tạo Personal Workspace.
6. Xác nhận quan hệ Workspace–User.
7. Trả kết quả initialization.

**Expected Results:**

- Workspace initialized successfully.
- Existing Workspace returned.
- Invalid User.
- Workspace initialization conflict.
- Database error.
- Internal error.

**Rules:**

- Một User chỉ có một Personal Workspace.
- Không tạo Workspace trùng lặp.
- Không cho phép client tự chỉ định Workspace owner.
- Operation phải idempotent.
- Việc tạo Workspace và liên kết User phải đảm bảo tính nhất quán dữ liệu.
- Nếu initialization thất bại, có thể retry mà không tạo dữ liệu trùng.

##### B02.2. Retrieve Current Workspace

**Purpose:** Lấy Personal Workspace của người dùng hiện tại.

**Input:**

- Authenticated User Context.

**Processing:**

1. Resolve Internal User ID từ trusted context.
2. Tìm Personal Workspace tương ứng.
3. Kiểm tra ownership.
4. Trả thông tin Workspace.

**Expected Results:**

- Workspace found.
- Workspace not found.
- Unauthenticated request.
- Access denied.
- Database error.

**Rules:**

- Không nhận owner ID từ frontend làm căn cứ xác thực.
- Không trả Workspace của người dùng khác.
- Không tự động tạo Workspace khi retrieve nếu chưa được quy định bởi initialization flow.
- Không trả dữ liệu Project thay cho Workspace entity.

##### B02.3. Retrieve Workspace Overview

**Purpose:** Cung cấp dữ liệu tổng quan cho màn hình Workspace.

**Output (Logical):**

- Workspace information.
- Project list hoặc Project summary.
- Independent Goal summary.
- Basic counts of organizational data where available.

**Processing:**

1. Xác định Workspace từ authenticated context.
2. Xác minh ownership.
3. Retrieve Workspace information.
4. Retrieve danh sách Project.
5. Truy xuất các thông tin tổng quan từ module sở hữu dữ liệu tương ứng.
6. Tổng hợp response.
7. Trả kết quả cho frontend.

**Rules:**

- B02 chỉ chịu trách nhiệm dữ liệu Workspace và Project.
- Goal data phải được truy xuất thông qua contract của B03.
- B02 không tự tạo bản sao độc lập của Goal.
- Không thực hiện progress calculation trong B02.
- Không tự xây dựng các bản sao Action, Milestone hoặc Measurement.
- Overview là dữ liệu tổng hợp để hiển thị, không phải nguồn dữ liệu nghiệp vụ mới.
- Không trả dữ liệu ngoài Workspace hiện tại.

##### B02.4. Create Project

**Purpose:** Tạo Project mới trong Personal Workspace.

**Input:**

- Project name.
- Project description (optional).

**Processing:**

1. Người dùng mở chức năng Create Project.
2. Nhập tên và mô tả.
3. Frontend kiểm tra input cơ bản.
4. Gửi request đến application/backend.
5. Backend resolve Workspace từ authenticated context.
6. Validate Workspace ownership.
7. Validate Project input.
8. Tạo Project trong Workspace.
9. Trả Project mới được tạo.

**Expected Results:**

- Project created successfully.
- Invalid Project name.
- Description too long (nếu có giới hạn được phê duyệt).
- Workspace not found.
- Access denied.
- Persistence error.

**Rules:**

- Project phải thuộc Workspace của người dùng hiện tại.
- Không nhận Workspace owner từ frontend.
- Không tự tạo Goal mặc định khi tạo Project.
- Không tạo Project trong Workspace khác.
- Không cho phép tên rỗng hoặc chỉ chứa khoảng trắng.
- Trim khoảng trắng thừa trong tên.
- Không bắt buộc tên Project phải duy nhất trên toàn hệ thống.
- Quy tắc trùng tên trong cùng Workspace cần được xác định theo domain decision; MVP không mặc định áp dụng unique constraint.
- Project creation phải lưu được `created_at` và `updated_at`.

##### B02.5. Retrieve Project

**Purpose:** Lấy thông tin một Project cụ thể.

**Input:**

- Project ID.

**Processing:**

1. Nhận Project ID.
2. Resolve authenticated User.
3. Retrieve Project.
4. Resolve Workspace sở hữu Project.
5. Validate Workspace ownership.
6. Trả Project nếu hợp lệ.

**Expected Results:**

- Project found.
- Project not found.
- Access denied.
- Unauthenticated request.
- Persistence error.

**Rules:**

- Project ID không đại diện cho quyền truy cập.
- Phải kiểm tra ownership thông qua Workspace.
- Không tiết lộ Project thuộc tài khoản khác.
- Không trả dữ liệu Project chỉ dựa trên ID do frontend cung cấp.

##### B02.6. List Workspace Projects

**Purpose:** Lấy danh sách Project của Personal Workspace.

**Input:**

- Authenticated User Context.

**Processing:**

1. Resolve Internal User ID.
2. Resolve Personal Workspace.
3. Query các Project thuộc Workspace.
4. Áp dụng thứ tự sắp xếp được quy định.
5. Trả danh sách Project.

**Expected Results:**

- Projects returned.
- Empty project list.
- Workspace not found.
- Access denied.
- Persistence error.

**Rules:**

- Chỉ trả Project thuộc Workspace của User hiện tại.
- Không trả Project thuộc User khác.
- Danh sách rỗng là kết quả hợp lệ.
- Không tự tạo dữ liệu giả khi Workspace chưa có Project.
- Pagination chưa bắt buộc với MVP nhưng data retrieval không được thiết kế theo cách ngăn cản việc bổ sung sau này.
- Sort mặc định có thể sử dụng thời điểm cập nhật mới nhất trước; thứ tự này phải được thống nhất trong implementation contract.

##### B02.7. Update Project

**Purpose:** Cập nhật thông tin cơ bản của Project.

**Input:**

- Project ID.
- Name (optional).
- Description (optional).

**Processing:**

1. Người dùng chọn Project.
2. Nhập thông tin cần thay đổi.
3. Validate input.
4. Backend resolve authenticated User.
5. Retrieve Project và Workspace owner.
6. Kiểm tra quyền sở hữu.
7. Cập nhật các trường hợp lệ.
8. Update `updated_at`.
9. Trả Project sau cập nhật.

**Expected Results:**

- Project updated successfully.
- Invalid input.
- Project not found.
- Access denied.
- Persistence error.

**Rules:**

- Chỉ chủ sở hữu Workspace được cập nhật Project.
- Project ID không được thay đổi.
- `workspace_id` không được tự ý thay đổi qua update.
- Không cho phép ghi đè toàn bộ dữ liệu bằng request thiếu trường.
- Các trường không được gửi lên phải được giữ nguyên.
- Name phải hợp lệ nếu được cập nhật.
- Description có thể null nếu quy định dữ liệu cho phép.

##### B02.8. Retrieve Project Overview

**Purpose:** Cung cấp thông tin tổng quan của một Project.

**Required Information:**

- Project information.
- Goals belonging to the Project.
- Basic Goal count.
- Basic organizational summary.

**Processing:**

1. Resolve Project từ Project ID.
2. Validate authenticated User.
3. Kiểm tra Project ownership.
4. Retrieve thông tin Project.
5. Retrieve Goal summary từ B03.
6. Tổng hợp thông tin cần thiết.
7. Trả Project Overview.

**Rules:**

- Project Overview không phải một nguồn dữ liệu độc lập.
- B02 không sở hữu Goal.
- Goal details phải tuân theo B03.
- Không tự tính Goal progress.
- Khi module Progress chưa sẵn sàng, không giả lập các giá trị progress.
- Không trả Goal thuộc Project của người dùng khác.

#### 6. Workspace and Project Ownership

**Purpose:** Bảo vệ phạm vi truy cập và duy trì tính nhất quán dữ liệu.

Logical ownership:

`User → Personal Workspace → Project`

Các Goal độc lập thuộc Workspace trực tiếp; các Goal được nhóm thuộc Project tham chiếu đến Project tương ứng.

**Rules:**

1. User sở hữu đúng một Personal Workspace trong MVP.
2. Workspace thuộc về một Internal User ID.
3. Project thuộc về một Workspace.
4. Project access phải được xác định thông qua Workspace ownership.
5. Workspace ID và Project ID do frontend gửi không được xem là bằng chứng quyền truy cập.
6. Backend phải resolve ownership từ dữ liệu đáng tin cậy.
7. Không cho phép truy cập chéo giữa các Workspace.
8. Không cho phép Project tham chiếu tới Workspace không tồn tại.
9. Không cho phép tạo Project với Workspace owner không hợp lệ.
10. Mọi thao tác đọc và ghi đều phải thực hiện ownership checks ở backend.

B02 cung cấp hoặc sử dụng ownership validation contracts để module nghiệp vụ kiểm tra phạm vi truy cập.

Các module nghiệp vụ vẫn chịu trách nhiệm kiểm tra quyền truy cập đối với dữ liệu thuộc sở hữu của module mình.

#### 7. Goal Placement and Cross-module Boundaries

**Purpose:** Cho phép tổ chức Goal trong Workspace hoặc trong Project mà không làm B02 trở thành module quản lý Goal.

**Approved Conceptual Model:**

Một Goal có thể:

- Được đặt trực tiếp trong Personal Workspace.
- Được đặt bên trong một Project.

Logical relationship:

`Workspace → Independent Goal`

`Workspace → Project → Goal`

**Rules:**

- Project không bắt buộc đối với Goal.
- Một Goal không được đồng thời bị xem là hai Goal khác nhau khi chuyển vị trí.
- Việc di chuyển Goal không được làm mất identity của Goal.
- Goal hierarchy thuộc trách nhiệm B03.
- B02 không triển khai create/update/delete Goal.
- B02 không tự thay đổi Goal parent-child relationships.
- B02 chỉ xác nhận Workspace/Project destination hợp lệ khi có thao tác phối hợp với B03.
- Việc di chuyển Goal phải sử dụng application contract chung, không thực hiện cập nhật dữ liệu trực tiếp từ frontend.
- Chi tiết transactional behavior, validation và atomicity của thao tác Move Goal phải được đặc tả trong B03.

**Cross-module responsibilities:**

| Capability | Responsible Module |
|---|---|
| Workspace management | B02 |
| Project management | B02 |
| Goal management | B03 |
| Goal hierarchy | B03 |
| Goal placement validation | B02 + B03 |
| Milestone management | B04 |
| Action management | B05 |
| Measurement management | B06 |
| Progress calculation | B08 |
| Review | B09 |

Không được đặt logic nghiệp vụ của module khác vào B02 chỉ để thuận tiện implementation.

#### 8. Logical Data Model

B02 quản lý hai logical entities chính:

**Workspace**

| Field | Description |
|---|---|
| `id` | Internal Workspace ID |
| `user_id` | Internal User ID sở hữu Workspace |
| `name` | Tên Workspace |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |

**Project**

| Field | Description |
|---|---|
| `id` | Internal Project ID |
| `workspace_id` | Workspace sở hữu Project |
| `name` | Tên Project |
| `description` | Mô tả, có thể null |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |

**Data Model Rules:**

- Internal User ID được tham chiếu từ B01.
- Workspace ID là định danh nội bộ độc lập với authentication provider.
- Project ID là định danh nội bộ.
- `Workspace.user_id` phải tham chiếu Internal User hợp lệ.
- `Project.workspace_id` phải tham chiếu Workspace hợp lệ.
- Một Workspace có thể chứa nhiều Project.
- Một User chỉ có một Workspace.
- Mọi entity phải duy trì dữ liệu thời điểm tạo và cập nhật.
- Database constraints phải đảm bảo quan hệ và uniqueness bắt buộc.
- B02 không tự quyết định kiểu ID, database technology hoặc migration strategy.

D01 chịu trách nhiệm thiết kế schema, constraints, indexes và persistence cho các entity này.

Dữ liệu Goal và quan hệ Goal–Project phải được đồng bộ với Domain Model của B03 và D01.

#### 9. Application Operations

B02 cung cấp các logical operations sau:

| Operation | Purpose |
|---|---|
| `initializePersonalWorkspace(userId)` | Tạo hoặc lấy Personal Workspace |
| `getCurrentWorkspace()` | Lấy Workspace hiện tại |
| `getWorkspaceOverview()` | Lấy tổng quan Workspace |
| `createProject(input)` | Tạo Project |
| `getProject(projectId)` | Lấy Project |
| `listProjects()` | Liệt kê Project |
| `updateProject(projectId, input)` | Cập nhật Project |
| `getProjectOverview(projectId)` | Lấy tổng quan Project |
| `validateWorkspaceOwnership(workspaceId)` | Kiểm tra Workspace ownership |
| `validateProjectOwnership(projectId)` | Kiểm tra Project ownership |

Đây là các thao tác ở cấp application/domain, chưa phải HTTP endpoint cuối cùng.

Chi tiết implementation phụ thuộc vào backend framework, database và shared contracts được lựa chọn.

**Cross-platform rule:**

- Business operations phải độc lập với browser APIs.
- Domain rules không phụ thuộc React hoặc bất kỳ UI framework nào.
- Không đưa logic ownership vào component.
- Web client là presentation client đầu tiên.
- Không xây dựng mobile app trong MVP.

#### 10. Validation and Error Handling

B02 cần xử lý các lỗi cơ bản:

| Error Code | Meaning |
|---|---|
| `WORKSPACE_NOT_FOUND` | Không tìm thấy Workspace |
| `WORKSPACE_ALREADY_EXISTS` | Workspace đã tồn tại |
| `WORKSPACE_ACCESS_DENIED` | Không có quyền truy cập Workspace |
| `WORKSPACE_INITIALIZATION_FAILED` | Khởi tạo Workspace thất bại |
| `WORKSPACE_INVALID_OWNER` | Owner không hợp lệ |
| `PROJECT_NOT_FOUND` | Không tìm thấy Project |
| `PROJECT_ACCESS_DENIED` | Không có quyền truy cập Project |
| `PROJECT_INVALID_NAME` | Tên Project không hợp lệ |
| `PROJECT_INVALID_INPUT` | Dữ liệu Project không hợp lệ |
| `PROJECT_CREATION_FAILED` | Tạo Project thất bại |
| `PROJECT_UPDATE_FAILED` | Cập nhật Project thất bại |
| `WORKSPACE_PROVIDER_ERROR` | Lỗi từ persistence layer |
| `WORKSPACE_UNKNOWN_ERROR` | Lỗi không xác định |

**Rules:**

- Không trả lỗi database hoặc provider nội bộ trực tiếp cho frontend.
- Sử dụng quy ước error response chung của D06.
- Phân biệt Not Found và Access Denied theo security policy đã phê duyệt; không để response tiết lộ dữ liệu của User khác.
- Validation phải thực hiện tại backend.
- Frontend validation chỉ nhằm cải thiện trải nghiệm người dùng.
- Error không được làm thay đổi dữ liệu ngoài ý muốn.
- Các lỗi có thể retry phải được xử lý an toàn.

#### 11. Dependencies

| Dependency | Purpose |
|---|---|
| B01 Authentication & User Context | Resolve Internal User ID và trạng thái xác thực |
| B03 Goal Management | Quản lý Goal và Goal placement |
| D01 Database & Persistence | Lưu Workspace và Project |
| D03 Shared Types & Contracts | Shared domain và application types |
| D04 Validation | Validate input và domain data |
| D06 Error Handling | Chuẩn hóa errors |
| D08 Security & Configuration | Các quy tắc và cấu hình security |

**Integration Rules:**

- B02 sử dụng User Context từ B01.
- B02 không triển khai Authentication logic.
- B02 sử dụng D01 để quản lý Workspace và Project persistence.
- B02 cung cấp Workspace/Project ownership context cho module liên quan.
- B02 phối hợp với B03 khi cần thao tác liên quan đến Goal placement.
- Không tạo logic Workspace hoặc Project riêng trong các business module khác.
- Không để B02 phụ thuộc vào frontend implementation.
- Không hardcode technology-specific provider logic vào domain operations.

#### 12. Security Requirements

MVP yêu cầu các biện pháp cơ bản nhưng bắt buộc:

- Chỉ authenticated user mới được truy cập Personal Workspace.
- Mỗi request phải resolve User từ trusted authentication context.
- Không tin tưởng Workspace ID hoặc User ID do frontend gửi lên.
- Backend phải kiểm tra ownership trước mọi thao tác đọc hoặc ghi.
- Project phải được kiểm tra ownership thông qua Workspace.
- Không cho phép truy cập dữ liệu chéo giữa các User.
- Không trả về dữ liệu của Project thuộc User khác.
- Không để frontend tự quyết định quyền truy cập.
- Không đưa privileged database credentials vào client code.
- Không ghi authentication secrets vào log.
- Không bypass authorization trong các thao tác tổng hợp Workspace hoặc Project Overview.

Các module sử dụng Workspace/Project reference phải thực hiện ownership validation trước khi truy xuất dữ liệu của mình.

Không xây dựng RBAC, team permission hoặc collaborative authorization trong MVP.

#### 13. Acceptance Criteria

B02 được xem là đạt yêu cầu MVP khi:

**Workspace Initialization**

- User đăng ký và có Internal User Identity hợp lệ.
- Workspace được khởi tạo đúng một lần.
- Gọi initialization nhiều lần không tạo dữ liệu trùng.
- User không thể sở hữu nhiều Personal Workspace.
- Workspace được liên kết đúng Internal User ID.
- Initialization failure có thể retry an toàn.

**Workspace Access**

- Người dùng lấy được Personal Workspace của mình.
- Người chưa xác thực không thể truy cập Workspace.
- Người dùng không thể lấy Workspace thuộc User khác.
- Backend không tin tưởng User ID do frontend cung cấp.
- Workspace Overview trả đúng dữ liệu thuộc phạm vi của User.

**Project Management**

- Người dùng tạo được Project trong Workspace của mình.
- Tên Project không hợp lệ bị từ chối.
- Người dùng lấy được Project của mình.
- Danh sách Project trả đúng dữ liệu.
- Danh sách rỗng được xử lý hợp lệ.
- Người dùng cập nhật được Project của mình.
- Người dùng không thể cập nhật Project của User khác.
- Project luôn được liên kết với Workspace hợp lệ.
- Project không thể tự ý đổi ownership thông qua update.

**Goal Placement Integration**

- Người dùng có thể tạo Goal độc lập trong Workspace.
- Người dùng có thể tạo Goal thuộc Project.
- B02 xác nhận destination Workspace/Project hợp lệ.
- B02 không tự quản lý Goal entity.
- B02 không làm mất Goal identity khi phối hợp di chuyển Goal.
- Project Overview không trả Goal trái quyền sở hữu.

**Data Integrity and Security**

- Không tạo Project trong Workspace không tồn tại.
- Không truy cập dữ liệu chéo giữa các User.
- Không sử dụng frontend User ID làm căn cứ duy nhất xác định ownership.
- Các thao tác quan trọng được validate tại backend.
- Các lỗi được chuẩn hóa theo D06.

#### 14. Testing Requirements

**Unit Tests**

- Workspace initialization rules.
- Workspace uniqueness validation.
- Project creation input validation.
- Project update validation.
- Workspace ownership validation.
- Project ownership validation.
- Workspace and Project relationship validation.
- Overview data assembly rules.

**Integration Tests**

- Initialize Workspace for a new Internal User.
- Initialize existing Workspace.
- Retry Workspace initialization.
- Retrieve current Workspace.
- Create Project.
- Retrieve Project.
- List Projects.
- Update Project.
- Retrieve Workspace Overview.
- Retrieve Project Overview.
- Persistence failure handling.

**Security Tests**

- Unauthenticated Workspace access.
- Invalid Internal User ID.
- Forged User ID from frontend.
- Access another user's Workspace.
- Access another user's Project.
- Update another user's Project.
- Project ID substitution attack.
- Workspace ID substitution attack.
- Access data through invalid Project–Workspace relationship.

**End-to-End Tests**

1. Register → Create Personal Workspace → Open Workspace.
2. Login → Retrieve Workspace → Refresh page → Workspace remains accessible.
3. Open Workspace → Create Project → Open Project.
4. Open Project → Update Project → Refresh → Updated information remains.
5. Create Independent Goal → Retrieve Workspace Overview.
6. Create Project → Create Goal inside Project → Retrieve Project Overview.
7. User A → Attempt to access User B's Workspace → Rejected.
8. User A → Attempt to update User B's Project → Rejected.

#### 15. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Approve Workspace and Project domain model | Product Owner |
| 2 | Define Workspace and Project schema | D01 |
| 3 | Define ownership and data-access contracts | B01, D03, D08 |
| 4 | Implement Personal Workspace initialization | B01, D01 |
| 5 | Implement Current Workspace retrieval | B01, D01 |
| 6 | Implement Workspace Overview | B03, D01 |
| 7 | Implement Project creation | D01, D04 |
| 8 | Implement Project retrieval and listing | D01 |
| 9 | Implement Project update | D01, D04 |
| 10 | Implement Project Overview | B03, D01 |
| 11 | Integrate Goal placement validation | B03 |
| 12 | Run ownership and security tests | B01, D08 |
| 13 | Run end-to-end integration tests | Required modules |

Triển khai theo từng bước nhỏ.

Không cần xây dựng thêm abstraction hoặc infrastructure không phục vụ trực tiếp phạm vi MVP.

#### 16. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Multiple Personal Workspaces.
- Team Workspace.
- Organization Management.
- Workspace Invitations.
- Workspace Membership.
- Team Collaboration.
- Role and Permission Management.
- Shared Projects.
- Project Templates.
- Project Duplication.
- Project Import / Export.
- Advanced Project Archive / Recovery.
- Cross-workspace Project Transfer.
- Workspace Customization.
- Workspace-level Automation.
- Project-level Analytics.
- Project-specific Billing.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế và có quyết định kiến trúc tương ứng.

#### 17. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Workspace Model | APPROVED FOR MVP | One Personal Workspace per User |
| Workspace Ownership | APPROVED | Owned by Internal User ID |
| Workspace Count | APPROVED FOR MVP | One per User |
| Project Model | APPROVED FOR MVP | Optional organizational container |
| Project Ownership | APPROVED FOR MVP | Project belongs to one Workspace |
| Project Requirement | APPROVED | Goal does not require Project |
| Independent Goal | APPROVED | Goal may belong directly to Workspace |
| Project Goal Relationship | APPROVED AT PRODUCT LEVEL | Project contains related Goals |
| Goal Hierarchy | B03 RESPONSIBILITY | Managed by Goal Management |
| Workspace Initialization | APPROVED | Idempotent operation |
| Workspace ID | APPROVED | Provider-independent Internal ID |
| Project ID | APPROVED | Provider-independent Internal ID |
| Database Technology | OPEN — D01 | Defined in D01 |
| API Strategy | OPEN — D03 | Defined in shared contracts |
| Project Delete Behavior | OPEN | Must be decided before deletion implementation |
| Project Archive Behavior | OPEN | Not required for initial MVP |
| Duplicate Project Name | OPEN | No global uniqueness assumption |
| Progress Aggregation | B08 RESPONSIBILITY | Not calculated by B02 |
| Team Workspace | FUTURE SCOPE | Not included |
| Cross-platform Domain Design | APPROVED PRINCIPLE | Keep business logic platform-independent |
| Native Mobile Application | FUTURE SCOPE | Not included in MVP |

#### 18. Ready-to-Code Status

**Specification Status:** READY TO CODE

**Development Status:** AVAILABLE once required domain, persistence and shared contracts are available.

**Implementation Status:** NOT_STARTED

**Remaining Dependencies:**

- B01: Provide authenticated Internal User Context and identity resolution.
- B03: Provide Goal model and Goal placement contracts.
- D01: Provide Workspace and Project persistence interfaces.
- D03: Provide shared Workspace and Project types/contracts.
- D04: Provide input validation.
- D06: Provide shared error response conventions.
- D08: Provide security and ownership enforcement mechanisms.

**Architecture Boundary:**

B02 owns Workspace and Project.

B02 does not own Goal, Milestone, Action, Measurement, Schedule, Progress or Review.

**Final Implementation Rule:** Build only the Personal Workspace and Project capabilities required by FLOW-UP MVP. Keep Workspace ownership, Project relationships and data access secure and consistent. Do not introduce Team Workspace, collaboration, complex permissions or unnecessary abstractions. Business logic and shared contracts must remain independent from the current web presentation layer so future clients can reuse them without building mobile functionality in the MVP.
### B03. Goal Management

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE FUNCTIONS / PARTIALLY BLOCKED  
**Development Status:** AVAILABLE FOR CORE FUNCTIONS  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

#### 1. Purpose

B03 chịu trách nhiệm quản lý Goal và cấu trúc phân cấp Goal trong FLOW-UP.

Goal đại diện cho một kết quả mà người dùng mong muốn đạt được.

B03 cung cấp khả năng tạo, truy xuất, chỉnh sửa, lưu trữ, xóa và tổ chức Goal thành cấu trúc phân cấp linh hoạt.

Mục tiêu của B03 là giúp người dùng:

- Xác định kết quả mong muốn.
- Chia một Goal lớn thành các Goal nhỏ hơn khi cần thiết.
- Quản lý cấu trúc Goal một cách linh hoạt.
- Theo dõi thông tin và trạng thái của từng Goal.
- Tổ chức Goal độc lập hoặc trong Project.
- Điều chỉnh cấu trúc Goal mà không làm mất dữ liệu liên quan.
- Cung cấp dữ liệu nhất quán cho các module nghiệp vụ khác.

B03 chỉ quản lý Goal và Goal hierarchy.

B03 không quản lý Milestone, Action, Measurement, Schedule hoặc Progress calculation.

#### 2. MVP Scope

**Included:**

- Create Goal.
- Retrieve Goal.
- Update Goal.
- Archive Goal.
- Delete Goal under approved rules.
- List Goals.
- Retrieve Goal hierarchy.
- Add Child Goal.
- Validate Parent–Child Relationships.
- Prevent Circular References.
- Prevent Invalid Hierarchy Operations.
- Support Flexible-depth Goal Hierarchy.
- Support Independent Goals.
- Support Project-associated Goals.
- Move Goals between Workspace and Project scopes.
- Preserve Goal Identity during Move.
- Preserve Descendants and Related Data during Move.
- Basic Goal Validation.
- Goal Ownership Validation.
- Basic Goal Error Handling.
- Goal Data Access Protection.

**Excluded:**

- Milestone Management.
- Action Management.
- Measurement Management.
- Schedule Management.
- Progress Calculation.
- Goal Analytics.
- Advanced Goal Recommendation.
- Autonomous Goal Restructuring.
- AI Goal Generation and Orchestration.
- Goal Templates.
- Goal Duplication.
- Goal Collaboration.
- Shared Goal Ownership.
- Advanced Goal Versioning.
- Goal Dependency Graph between unrelated Goals.
- Arbitrary Formula-based Goal Evaluation.
- Advanced Goal Notification System.

AI-generated Goal proposals are handled by B10.

B03 chỉ tiếp nhận và thực hiện các thay đổi đã được người dùng phê duyệt thông qua application/domain operations hợp lệ.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm thực sự có nhu cầu.

#### 3. Goal Model

**Approved Concept: Goal represents an Outcome**

Goal là thực thể trung tâm mô tả kết quả người dùng muốn đạt được.

Ví dụ:

- Improve English proficiency to IELTS 7.0.
- Complete FLOW-UP MVP.
- Increase body weight to 53 kg.
- Learn Python well enough to develop an AI application.

Goal có thể:

- Tồn tại độc lập trong Personal Workspace.
- Thuộc một Project.
- Có các Child Goals.
- Có một hoặc nhiều Milestones.
- Có Measurement definitions và recorded values.
- Có Target Date hoặc Expected Completion Period tùy chọn.
- Được di chuyển giữa Independent Workspace Scope và Project Scope.

**Goal hierarchy:**

`Parent Goal → Child Goal → Sub-child Goal`

Goal hierarchy có độ sâu linh hoạt, không giới hạn cố định ở hai hoặc ba cấp.

**Core Conceptual Rules:**

- Goal mô tả Outcome, không phải một công việc cần thực hiện.
- Action mô tả công việc người dùng thực hiện.
- Milestone mô tả một checkpoint quan trọng.
- Measurement mô tả cách đánh giá một khía cạnh của kết quả.
- Goal Tree là cách biểu diễn quan hệ giữa các Goal.
- Goal Tree không phải một entity độc lập.
- Không bắt buộc mọi Goal phải có Child Goals.
- Không bắt buộc mọi Goal phải có Milestone.
- Không bắt buộc mọi Goal phải có Measurement.
- Không bắt buộc mọi Goal phải có Deadline.

#### 4. Logical Data Model

**Goal**

| Field | Description |
|---|---|
| `id` | Internal Goal ID |
| `workspace_id` | Workspace sở hữu Goal |
| `project_id` | Project chứa Goal, có thể null |
| `parent_goal_id` | Parent Goal ID, có thể null |
| `title` | Tên Goal |
| `description` | Mô tả Goal, có thể null |
| `target_date` | Ngày mục tiêu, có thể null |
| `status` | Trạng thái Goal |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |
| `archived_at` | Thời điểm archive, có thể null |

Đây là logical data model, chưa phải database schema được phê duyệt.

**Field Rules:**

- `id` là định danh nội bộ duy nhất.
- `workspace_id` xác định Workspace sở hữu Goal.
- `project_id` xác định Project chứa Goal; null biểu thị Goal độc lập trong Workspace.
- `parent_goal_id` xác định Goal cha; null biểu thị Goal ở cấp gốc.
- `title` là trường bắt buộc.
- `description` là trường tùy chọn.
- `target_date` là trường tùy chọn.
- `status` phải thuộc trạng thái được định nghĩa trong Domain Model.
- `created_at` không thay đổi sau khi tạo.
- `updated_at` thay đổi khi Goal được cập nhật.
- `archived_at` chỉ được sử dụng khi Goal được archive.

**Relationship Model:**

| Relationship | Cardinality |
|---|---|
| Workspace → Goal | 1:N |
| Project → Goal | 1:N |
| Goal → Child Goal | 1:N |
| Goal → Milestone | 1:N |
| Goal → Measurement | 1:N hoặc theo Domain Model được duyệt |

Mỗi Goal thuộc đúng một Workspace.

Một Goal có thể thuộc một Project hoặc tồn tại độc lập trong Workspace.

Một Goal có tối đa một Parent Goal.

Một Goal có thể có nhiều Child Goals.

**Important Rules:**

- Không tạo nhiều bản ghi Goal chỉ để biểu diễn nhiều cấp hierarchy.
- Không sử dụng Project như một loại Goal.
- Không sử dụng Milestone thay thế Child Goal.
- Không tạo bản sao Goal khi thay đổi vị trí trong Workspace.
- Các quan hệ với Milestone, Action và Measurement phải sử dụng stable Internal IDs.

D01 chịu trách nhiệm thiết kế schema, constraints, indexes và persistence.

Các cardinality chưa được xác định trong Domain Model phải được đánh dấu OPEN trước khi chốt database schema.

#### 5. Core Functions

##### B03.1. Create Goal

**Purpose:** Tạo Goal mới trong Workspace hoặc Project.

**Input:**

- Title.
- Description (optional).
- Target Date (optional).
- Project ID (optional).
- Parent Goal ID (optional).

**Processing:**

1. Người dùng chọn Create Goal.
2. Nhập thông tin Goal.
3. Frontend validate dữ liệu cơ bản.
4. Gửi request đến application/backend.
5. Resolve authenticated User từ trusted context.
6. Resolve Workspace tương ứng.
7. Validate Workspace ownership.
8. Nếu có Project ID, validate Project thuộc Workspace hiện tại.
9. Nếu có Parent Goal ID, validate Parent Goal hợp lệ.
10. Validate dữ liệu Goal.
11. Tạo Goal.
12. Lưu các quan hệ hợp lệ.
13. Trả Goal mới được tạo.

**Expected Results:**

- Goal created successfully.
- Invalid Goal title.
- Invalid description.
- Invalid target date.
- Workspace not found.
- Project not found.
- Parent Goal not found.
- Parent Goal relationship invalid.
- Access denied.
- Persistence error.

**Rules:**

- Goal phải thuộc một Workspace.
- Goal có thể tồn tại độc lập hoặc thuộc Project.
- Không bắt buộc Project ID.
- Không bắt buộc Parent Goal ID.
- Parent Goal phải thuộc cùng phạm vi Workspace.
- Không cho phép Parent Goal thuộc Workspace khác.
- Không cho phép Goal tự làm Parent của chính nó.
- Không cho phép tạo circular hierarchy.
- Không tự động tạo Milestone hoặc Action.
- Không tạo Goal trùng lặp ngoài ý muốn.
- Goal creation phải giữ nguyên tính nhất quán của Workspace, Project và Parent relationships.

##### B03.2. Retrieve Goal

**Purpose:** Lấy thông tin chi tiết của một Goal.

**Input:**

- Goal ID.

**Processing:**

1. Nhận Goal ID.
2. Resolve authenticated User.
3. Retrieve Goal.
4. Resolve Workspace ownership.
5. Kiểm tra quyền truy cập.
6. Retrieve các thông tin thuộc phạm vi B03.
7. Trả Goal details.

**Expected Results:**

- Goal found.
- Goal not found.
- Access denied.
- Unauthenticated request.
- Persistence error.

**Rules:**

- Goal ID không đại diện cho quyền truy cập.
- Phải kiểm tra Workspace ownership.
- Không trả Goal thuộc User khác.
- Không truy xuất các entity thuộc module khác bằng logic persistence riêng.
- Các thông tin Milestone, Action hoặc Measurement nếu cần phải lấy thông qua contracts tương ứng.
- Không trả archived Goal như một Goal đang hoạt động nếu use case yêu cầu active Goal.

##### B03.3. List Goals

**Purpose:** Lấy danh sách Goal theo phạm vi Workspace hoặc Project.

**Input:**

- Workspace ID hoặc authenticated Workspace context.
- Project ID (optional).
- Parent Goal ID (optional).
- Goal status filter (optional).

**Processing:**

1. Resolve authenticated User.
2. Resolve Workspace.
3. Validate ownership.
4. Validate Project nếu được cung cấp.
5. Áp dụng các bộ lọc hợp lệ.
6. Retrieve danh sách Goal.
7. Trả kết quả.

**Expected Results:**

- Goals returned.
- Empty Goal list.
- Invalid filter.
- Project not found.
- Access denied.
- Persistence error.

**Rules:**

- Chỉ trả Goal thuộc Workspace được phép truy cập.
- Khi lọc theo Project, chỉ trả Goal thuộc Project đó.
- Khi lọc theo Parent Goal, chỉ trả các Child Goals trực tiếp.
- Không tự động đưa archived Goals vào danh sách active.
- Danh sách rỗng là kết quả hợp lệ.
- Không tạo dữ liệu giả khi không có Goal.
- Không yêu cầu frontend tải toàn bộ hierarchy nếu chỉ cần danh sách ở một cấp.
- Pagination có thể bổ sung sau nhưng không được ngăn cản khả năng mở rộng.

##### B03.4. Update Goal

**Purpose:** Cập nhật thông tin của Goal.

**Input:**

- Goal ID.
- Title (optional).
- Description (optional).
- Target Date (optional).
- Các trường được phép cập nhật khác theo approved Goal contract.

**Processing:**

1. Người dùng mở Goal.
2. Chỉnh sửa thông tin.
3. Validate input.
4. Resolve authenticated User.
5. Retrieve Goal.
6. Validate ownership.
7. Kiểm tra các trường được phép thay đổi.
8. Validate dữ liệu mới.
9. Cập nhật Goal.
10. Update `updated_at`.
11. Trả Goal sau cập nhật.

**Expected Results:**

- Goal updated successfully.
- Goal not found.
- Invalid input.
- Access denied.
- Persistence error.

**Rules:**

- Không thay đổi Goal ID.
- Không thay đổi Workspace ownership thông qua update thông thường.
- Không thay đổi Parent relationship nếu không sử dụng operation chuyên biệt.
- Không tự ý thay đổi Project placement thông qua update thông thường.
- Không ghi đè các trường không được gửi lên.
- Title không được rỗng.
- Không cho phép cập nhật Goal đã bị xóa.
- Việc cập nhật Goal không được làm mất các quan hệ hợp lệ.

##### B03.5. Archive Goal

**Purpose:** Đưa Goal ra khỏi phạm vi hoạt động mà không xóa ngay dữ liệu.

Archive được xem là một thao tác quản lý vòng đời dữ liệu, khác với Delete.

**Input:**

- Goal ID.

**Processing:**

1. Người dùng chọn Archive Goal.
2. Resolve authenticated User.
3. Retrieve Goal.
4. Validate ownership.
5. Kiểm tra trạng thái hiện tại.
6. Thực hiện archive theo approved lifecycle rules.
7. Ghi nhận `archived_at`.
8. Trả kết quả.

**Expected Results:**

- Goal archived successfully.
- Goal not found.
- Goal already archived.
- Access denied.
- Invalid state transition.
- Persistence error.

**Rules:**

- Archive không đồng nghĩa với Delete.
- Không xóa Goal khỏi database.
- Không thay đổi Goal ID.
- Không tự động xóa Milestone, Action hoặc Measurement.
- Archived Goal không xuất hiện trong danh sách active mặc định.
- Goal đã archive phải được xử lý theo lifecycle rules được phê duyệt.
- Không cho phép tiếp tục thực hiện các thao tác thông thường trên archived Goal nếu chưa có quy tắc cho phép.

**OPEN:**

- Archive một Parent Goal có tự động archive descendants không?
- Archived Goal có được restore trong MVP không?
- Action và Milestone liên quan có bị giới hạn thao tác khi Goal archive không?

Các quy tắc này phải được chốt trong Domain Model trước khi triển khai lifecycle hoàn chỉnh.

##### B03.6. Delete Goal

**Purpose:** Xóa Goal theo quy tắc đã được phê duyệt.

Delete là thao tác khác với Archive và có khả năng ảnh hưởng đến dữ liệu liên quan.

**Input:**

- Goal ID.
- Confirmation (required at UI level for destructive operation).

**Processing:**

1. Người dùng chọn Delete Goal.
2. Hiển thị xác nhận.
3. Resolve authenticated User.
4. Retrieve Goal.
5. Validate ownership.
6. Kiểm tra các quan hệ phụ thuộc.
7. Kiểm tra trạng thái và điều kiện xóa.
8. Thực hiện deletion theo approved deletion policy.
9. Trả kết quả.

**Expected Results:**

- Goal deleted successfully.
- Goal not found.
- Access denied.
- Goal has dependent records.
- Deletion not permitted.
- Persistence error.

**Rules:**

- Không xóa Goal chỉ vì frontend gửi yêu cầu.
- Không tự động xóa dữ liệu liên quan khi chưa có deletion policy.
- Không để lại các foreign key references không hợp lệ.
- Phải kiểm tra descendants, Milestones, Actions và Measurements.
- Deletion phải bảo đảm tính toàn vẹn dữ liệu.
- Destructive operation phải có xác nhận phù hợp.
- Delete phải được thực hiện thông qua backend application operation.

**OPEN — BLOCKING:**

- Hard delete hay soft delete?
- Có cho phép xóa Goal có Child Goals không?
- Có xóa cascade descendants không?
- Xử lý Milestone, Action, Measurement và history thế nào?
- Có yêu cầu archive trước khi delete không?

Không implement destructive deletion trước khi các quy tắc này được phê duyệt.

##### B03.7. Add Child Goal

**Purpose:** Tạo Goal con cho một Parent Goal hiện có.

**Input:**

- Parent Goal ID.
- Child Goal title.
- Description (optional).
- Target Date (optional).

**Processing:**

1. Người dùng chọn Add Child Goal.
2. Nhập thông tin Goal con.
3. Validate input.
4. Resolve Parent Goal.
5. Validate Parent Goal ownership.
6. Xác định Workspace và Project scope của Parent.
7. Validate các quan hệ.
8. Tạo Child Goal với `parent_goal_id` tương ứng.
9. Trả Child Goal.

**Expected Results:**

- Child Goal created successfully.
- Parent Goal not found.
- Invalid Parent Goal.
- Circular relationship prevented.
- Access denied.
- Persistence error.

**Rules:**

- Child Goal phải thuộc cùng Workspace với Parent Goal.
- Child Goal phải có đúng Parent Goal được chỉ định.
- Không cho phép Parent Goal thuộc Workspace khác.
- Child Goal phải tuân theo quy tắc Project scope của Parent.
- Không cho phép tạo quan hệ tự tham chiếu.
- Không giới hạn hierarchy depth cố định.
- Không tạo một Goal Tree entity mới.
- Không tự động tạo Milestone hoặc Action.

##### B03.8. Retrieve Goal Hierarchy

**Purpose:** Lấy cấu trúc Goal hierarchy để hiển thị List, Outline hoặc Goal Tree.

**Input:**

- Workspace ID hoặc Project ID.
- Root Goal ID (optional).
- Include archived (optional, subject to approved access rules).

**Processing:**

1. Resolve authenticated User.
2. Resolve Workspace.
3. Validate ownership.
4. Validate Project nếu có.
5. Retrieve các Goal thuộc phạm vi yêu cầu.
6. Resolve Parent–Child relationships.
7. Xây dựng hierarchical response.
8. Kiểm tra tính nhất quán của hierarchy.
9. Trả Goal hierarchy.

**Logical Output:**

- Goal ID.
- Parent Goal ID.
- Title.
- Description (nếu cần).
- Status.
- Target Date.
- Child Goals.
- Hierarchy level hoặc cấu trúc tương đương nếu cần cho presentation.

**Rules:**

- Hierarchy phải phản ánh dữ liệu Goal thực tế.
- Không tạo Goal giả chỉ để lấp đầy cấu trúc.
- Không sử dụng UI Tree làm nguồn dữ liệu.
- Không thay đổi Goal data khi retrieve hierarchy.
- Không để một Goal xuất hiện sai vị trí hoặc nhiều lần trong cùng một cây.
- Không truy xuất dữ liệu ngoài phạm vi Workspace.
- Hỗ trợ hierarchy có nhiều cấp.
- Có thể retrieve một Root Goal cùng descendants thay vì tải toàn bộ Workspace.
- Không tính authoritative progress trong B03.

##### B03.9. Validate Parent–Child Relationships

**Purpose:** Đảm bảo mọi quan hệ Parent–Child hợp lệ.

**Validation Rules:**

1. Parent Goal phải tồn tại.
2. Child Goal phải tồn tại nếu đang thực hiện thao tác cập nhật quan hệ.
3. Parent và Child phải thuộc cùng Workspace.
4. Không cho phép Goal làm Parent của chính nó.
5. Không cho phép Parent–Child relationship tạo circular reference.
6. Không cho phép quan hệ vượt qua ownership boundary.
7. Quan hệ phải phù hợp với Project scope rules.
8. Không cho phép liên kết Goal đã bị xóa.
9. Archived Goal phải tuân theo lifecycle rules đã phê duyệt.

**Processing:**

1. Resolve các Goal liên quan.
2. Kiểm tra Workspace ownership.
3. Kiểm tra Project scope.
4. Kiểm tra trạng thái Goal.
5. Kiểm tra khả năng tạo circular reference.
6. Trả validation result.

**Circular Reference Example:**

Invalid:

`A → B → C → A`

Invalid:

`A → A`

Valid:

`A → B → C → D`

**Rules:**

- Goal hierarchy phải là Directed Acyclic Graph theo cấu trúc Parent–Child dạng cây.
- Một Goal chỉ có tối đa một Parent Goal.
- Không cho phép cycle.
- Validation phải thực hiện ở backend/domain layer.
- Frontend không được là nơi duy nhất kiểm tra hierarchy validity.

##### B03.10. Move Goal

**Purpose:** Di chuyển Goal giữa Independent Workspace Scope và Project Scope.

Đây là thao tác thay đổi vị trí tổ chức của Goal, không phải tạo một Goal mới.

**Supported Destination:**

- Independent Workspace Scope.
- Project Scope.

**Input:**

- Goal ID.
- Destination Workspace ID hoặc trusted Workspace context.
- Destination Project ID (optional).
- Operation confirmation nếu cần.

**Processing:**

1. Người dùng chọn Move Goal.
2. Chọn destination.
3. Resolve authenticated User.
4. Retrieve Goal hiện tại.
5. Validate Goal ownership.
6. Validate destination Workspace.
7. Nếu destination là Project Scope, validate Project ownership.
8. Validate các ràng buộc hierarchy.
9. Validate các quan hệ liên quan.
10. Thực hiện move theo approved transaction policy.
11. Giữ nguyên Goal ID.
12. Giữ nguyên các quan hệ hợp lệ.
13. Trả Goal sau khi move.

**Expected Results:**

- Goal moved successfully.
- Goal not found.
- Destination not found.
- Destination invalid.
- Access denied.
- Invalid hierarchy operation.
- Related data conflict.
- Move failed.

**Rules:**

- Move không tạo bản ghi Goal mới.
- Không thay đổi Goal ID.
- Không thay đổi Workspace ownership.
- Không cho phép chuyển Goal sang Workspace của User khác.
- Khi chuyển vào Project, Project phải thuộc Workspace hiện tại.
- Khi chuyển về Independent Workspace Scope, `project_id` được cập nhật theo destination model.
- Không tự động thay đổi Goal title hoặc description.
- Không tự động xóa Child Goals.
- Không làm mất Milestones, Actions, Measurements hoặc history.
- Không thay đổi stable IDs của dữ liệu liên quan.
- Không tạo duplicate records.
- Move phải đảm bảo tính toàn vẹn dữ liệu.
- Khi có lỗi, hệ thống không được để lại trạng thái cập nhật một phần.

**Related Data Preservation:**

Một thao tác Move phải bảo toàn:

- Goal identity.
- Child Goal relationships.
- Milestone relationships.
- Action relationships.
- Measurement definitions.
- Measurement records.
- Schedule references thông qua các entity liên quan.
- Progress history nếu có.
- Review history nếu có.

B03 không trực tiếp quản lý các entity này. Các module sở hữu dữ liệu tương ứng phải bảo đảm quan hệ vẫn hợp lệ sau khi move.

**OPEN — BLOCKING:**

- Có cho phép di chuyển một Child Goal độc lập khỏi Parent không?
- Khi di chuyển một Root Goal, toàn bộ descendants có tự động thay đổi Project scope không?
- Nếu Project đích khác Project hiện tại, xử lý Child Goals thế nào?
- Có cho phép move khi Goal có Action đang được schedule không?
- Transaction boundary giữa các module được thực hiện bằng application service nào?

Không triển khai Move Goal production-ready trước khi chốt các quyết định này.

#### 6. Goal Hierarchy Rules

**Purpose:** Đảm bảo Goal hierarchy luôn hợp lệ và có thể phát triển linh hoạt.

**Approved Conceptual Structure:**

```text
Workspace
│
├── Independent Goal A
│   ├── Child Goal A1
│   │   └── Child Goal A1.1
│   └── Child Goal A2
│
└── Project
    │
    ├── Goal B
    │   ├── Child Goal B1
    │   └── Child Goal B2
    │
    └── Goal C
```

Đây là mô hình minh họa. Các quan hệ chính thức được xác định bởi Goal data và Parent–Child contracts.

**Rules:**

- Goal hierarchy có độ sâu linh hoạt.
- Một Goal có tối đa một Parent Goal.
- Một Parent Goal có thể có nhiều Child Goals.
- Không bắt buộc mọi Goal phải có Child Goals.
- Không bắt buộc mọi Goal phải có cùng số lượng Child Goals.
- Không giới hạn cứng số cấp hierarchy trong MVP.
- Không cho phép cycle.
- Không cho phép Parent Goal thuộc Workspace khác.
- Child Goal không được trở thành một bản sao của Parent Goal.
- Không sử dụng Project để thay thế Parent Goal.
- Không sử dụng Milestone để thay thế Child Goal.

**Hierarchy Integrity:**

B03 phải bảo đảm:

- Mỗi Goal có một định danh ổn định.
- Parent reference phải hợp lệ.
- Child references phải nhất quán với Parent reference.
- Không có circular references.
- Không có orphaned Goal do thao tác hierarchy không hợp lệ.
- Các thao tác cập nhật hierarchy phải được thực hiện tại backend/domain layer.

#### 7. Goal Lifecycle

Goal cần có lifecycle rõ ràng để các module nghiệp vụ sử dụng thống nhất.

**Initial Logical States:**

| State | Meaning |
|---|---|
| `ACTIVE` | Goal đang được sử dụng |
| `COMPLETED` | Goal đã đạt kết quả mong muốn |
| `ARCHIVED` | Goal đã được lưu trữ |
| `DELETED` | Goal đã bị xóa theo deletion policy |

Đây là các trạng thái đề xuất cho lifecycle, cần được xác nhận trong Domain Model.

**Rules:**

- Goal mới được tạo ở trạng thái mặc định theo approved domain rule.
- Goal không được chuyển trạng thái tùy ý.
- Archive khác Complete.
- Complete khác Delete.
- Deleted Goal không được sử dụng như một Goal đang hoạt động.
- Không tự động đánh dấu Parent Goal là Completed khi Child Goal hoàn thành.
- Không tự động đánh dấu tất cả Child Goals là Completed khi Parent Goal hoàn thành.
- Không tự động tính trạng thái Goal từ số lượng Action hoàn thành.
- Các quy tắc chuyển trạng thái phải được phê duyệt trước implementation.

**OPEN:**

- Goal status lifecycle chính thức.
- Điều kiện chuyển sang COMPLETED.
- Có cho phép reopen Goal đã hoàn thành không?
- Quan hệ giữa trạng thái Parent và Child.
- Có cho phép archive Goal đã hoàn thành không?

#### 8. Workspace and Project Integration

**Purpose:** Đảm bảo Goal được tổ chức đúng trong Workspace và Project.

**Approved Placement Model:**

`Workspace → Independent Goal`

`Workspace → Project → Goal`

**Rules:**

- Workspace là container gốc.
- Project là container tổ chức tùy chọn.
- Goal có thể tồn tại trực tiếp trong Workspace.
- Goal có thể thuộc Project.
- Project không phải điều kiện bắt buộc để tạo Goal.
- Một Goal không được thuộc hai Project cùng lúc.
- Một Goal không được đồng thời có Independent Scope và Project Scope.
- Parent–Child relationships phải tuân theo scope rules.
- B02 chịu trách nhiệm Workspace và Project ownership.
- B03 chịu trách nhiệm Goal và Goal hierarchy.
- B03 phối hợp B02 để validate destination khi move.

**Cross-module Contract:**

| Operation | Responsible Module |
|---|---|
| Resolve authenticated User | B01 |
| Resolve Personal Workspace | B02 |
| Validate Workspace ownership | B02 |
| Validate Project ownership | B02 |
| Create Goal | B03 |
| Update Goal | B03 |
| Retrieve Goal hierarchy | B03 |
| Validate Parent–Child relationship | B03 |
| Move Goal | B03 + B02 |
| Manage Milestones | B04 |
| Manage Actions | B05 |
| Manage Measurements | B06 |
| Calculate Progress | B08 |
| Review Goal results | B09 |
| Generate Goal proposals | B10 |

Không tạo logic Goal riêng trong B02 hoặc B10.

#### 9. Application Operations

B03 cung cấp các logical operations sau:

| Operation | Purpose |
|---|---|
| `createGoal(input)` | Tạo Goal |
| `getGoal(goalId)` | Lấy Goal |
| `listGoals(scope, filters)` | Lấy danh sách Goal |
| `updateGoal(goalId, input)` | Cập nhật Goal |
| `archiveGoal(goalId)` | Archive Goal |
| `deleteGoal(goalId)` | Xóa Goal theo approved policy |
| `addChildGoal(parentGoalId, input)` | Tạo Goal con |
| `getGoalHierarchy(scope, options)` | Lấy Goal hierarchy |
| `validateParentChild(parentId, childId)` | Kiểm tra quan hệ cha-con |
| `moveGoal(goalId, destination)` | Di chuyển Goal |
| `validateGoalOwnership(goalId)` | Kiểm tra quyền sở hữu Goal |
| `validateGoalPlacement(goalId, destination)` | Kiểm tra vị trí Goal |

Đây là các thao tác ở cấp kiến trúc, chưa phải HTTP endpoint cuối cùng.

Chi tiết implementation phụ thuộc vào backend framework, shared contracts và Domain Model được phê duyệt.

**Operation Rules:**

- Các operation phải sử dụng trusted User Context từ B01.
- Không nhận quyền sở hữu từ frontend làm căn cứ xác thực.
- Không đưa database-specific implementation vào business operations.
- Các thao tác thay đổi hierarchy phải bảo đảm tính toàn vẹn dữ liệu.
- Move phải là một application workflow thống nhất.
- Không để frontend thực hiện nhiều database writes độc lập để hoàn thành một nghiệp vụ Move.

#### 10. Error Handling

B03 cần xử lý các lỗi cơ bản:

| Error Code | Meaning |
|---|---|
| `GOAL_NOT_FOUND` | Không tìm thấy Goal |
| `GOAL_ACCESS_DENIED` | Không có quyền truy cập Goal |
| `GOAL_INVALID_TITLE` | Title không hợp lệ |
| `GOAL_INVALID_INPUT` | Input không hợp lệ |
| `GOAL_ALREADY_ARCHIVED` | Goal đã được archive |
| `GOAL_ALREADY_COMPLETED` | Goal đã hoàn thành |
| `GOAL_INVALID_STATE_TRANSITION` | Chuyển trạng thái không hợp lệ |
| `GOAL_HAS_DEPENDENCIES` | Goal có dữ liệu phụ thuộc |
| `GOAL_DELETION_NOT_ALLOWED` | Không được phép xóa Goal |
| `GOAL_PARENT_NOT_FOUND` | Không tìm thấy Parent Goal |
| `GOAL_PARENT_INVALID` | Parent Goal không hợp lệ |
| `GOAL_CIRCULAR_REFERENCE` | Phát hiện circular reference |
| `GOAL_INVALID_HIERARCHY` | Cấu trúc hierarchy không hợp lệ |
| `GOAL_INVALID_PLACEMENT` | Vị trí Goal không hợp lệ |
| `GOAL_MOVE_FAILED` | Di chuyển Goal thất bại |
| `GOAL_DESTINATION_NOT_FOUND` | Không tìm thấy destination |
| `GOAL_OWNERSHIP_MISMATCH` | Ownership không khớp |
| `GOAL_PERSISTENCE_ERROR` | Lỗi persistence |
| `GOAL_UNKNOWN_ERROR` | Lỗi không xác định |

**Rules:**

- Không trả trực tiếp lỗi nội bộ của database cho frontend.
- Sử dụng quy ước error response chung của D06.
- Không tiết lộ dữ liệu Goal của User khác thông qua error message.
- Các thao tác thay đổi hierarchy phải có error handling rõ ràng.
- Không để lỗi một phần của Move tạo ra dữ liệu không nhất quán.
- Không ghi các thông tin nhạy cảm vào log.

#### 11. Dependencies

| Dependency | Purpose |
|---|---|
| B01 Authentication & User Context | Resolve authenticated User |
| B02 Workspace & Project Management | Validate Workspace và Project scope |
| B04 Milestone Management | Các quan hệ Milestone |
| B05 Action Management | Các quan hệ Action |
| B06 Measurement Management | Các quan hệ Measurement |
| B08 Progress Engine | Cung cấp Progress data |
| B09 Review Management | Các thông tin Review liên quan |
| B10 AI Orchestration | Tiếp nhận Goal proposals đã được duyệt |
| D01 Database & Persistence | Lưu Goal và hierarchy |
| D03 Shared Types & Contracts | Shared domain types |
| D04 Validation | Input và domain validation |
| D05 API / Application Communication | Application communication |
| D06 Error Handling | Chuẩn hóa lỗi |
| D08 Security & Configuration | Ownership và security |

**Integration Rules:**

- B03 sử dụng User Context từ B01.
- B03 sử dụng B02 để kiểm tra Workspace/Project destination.
- B03 sở hữu Goal entity và hierarchy rules.
- B04, B05 và B06 sở hữu các entity tương ứng.
- B08 sở hữu progress calculations.
- B09 sở hữu review logic.
- B10 chỉ tạo proposals và gửi các thay đổi đã được user approval đến B03.
- Không cho phép AI ghi trực tiếp Goal vào database bỏ qua B03.
- Không tạo các bản sao Goal giữa các module.

#### 12. Security Requirements

MVP yêu cầu các biện pháp bảo vệ dữ liệu sau:

- Chỉ authenticated User mới được thao tác với Goal cá nhân.
- Resolve User ID từ trusted authentication context.
- Validate Goal ownership ở backend.
- Validate Workspace ownership.
- Validate Project ownership khi Goal thuộc Project.
- Không tin tưởng Goal ID hoặc Parent Goal ID do frontend gửi.
- Không cho phép truy cập Goal của User khác.
- Không cho phép sửa Parent–Child relationships vượt qua ownership boundary.
- Không cho phép move Goal sang Project thuộc User khác.
- Không cho phép AI bypass domain validation.
- Không cho phép frontend trực tiếp thay đổi hierarchy trong database.
- Destructive operations phải tuân theo approved deletion policy.
- Không ghi authentication secrets hoặc thông tin nhạy cảm vào log.

**Data Integrity Requirements:**

- Không có circular references.
- Không có orphaned Goal do thao tác không hợp lệ.
- Không có duplicate Goal do retry operation.
- Không có mất dữ liệu liên quan trong Move.
- Không có partial hierarchy updates khi operation thất bại.

#### 13. Acceptance Criteria

B03 được xem là đạt yêu cầu MVP khi:

**Goal Creation**

- Người dùng tạo được Goal trong Workspace.
- Người dùng tạo được Goal trong Project.
- Người dùng tạo được Goal không có Project.
- Title không hợp lệ bị từ chối.
- Target Date tùy chọn được xử lý đúng.
- Goal được liên kết đúng Workspace.
- Goal không bị tạo trùng ngoài ý muốn.

**Goal Retrieval and Update**

- Người dùng lấy được Goal của mình.
- Người dùng không thể truy cập Goal của tài khoản khác.
- Người dùng lấy được danh sách Goal.
- Danh sách rỗng được xử lý đúng.
- Người dùng cập nhật được Goal.
- Update không làm thay đổi Goal ID.
- Update không làm mất các quan hệ hợp lệ.

**Goal Hierarchy**

- Người dùng tạo được Child Goal.
- Hỗ trợ nhiều cấp hierarchy.
- Parent–Child relationships được lưu đúng.
- Không tạo được self-reference.
- Không tạo được circular reference.
- Không tạo được quan hệ chéo Workspace.
- Goal hierarchy được retrieve đúng.
- Một Goal không xuất hiện trùng trong cùng một cây.
- Invalid hierarchy operations bị từ chối.

**Goal Lifecycle**

- Goal được archive theo approved lifecycle rules.
- Archived Goal không xuất hiện trong active list mặc định.
- Archive không đồng nghĩa với Delete.
- Goal completion không tự động thay đổi trạng thái các Goal liên quan nếu chưa có rule được duyệt.
- Delete chỉ được thực hiện theo approved deletion policy.

**Goal Placement and Move**

- Goal có thể tồn tại độc lập trong Workspace.
- Goal có thể thuộc Project.
- Destination được kiểm tra ownership.
- Move không tạo Goal mới.
- Goal ID được giữ nguyên.
- Dữ liệu liên quan không bị mất.
- Move thất bại không để lại trạng thái dữ liệu một phần.
- Các trường hợp move chưa được phê duyệt bị từ chối.

**Security and Data Integrity**

- Người dùng không truy cập được Goal của User khác.
- Backend không tin tưởng ID do frontend gửi.
- Không có circular hierarchy.
- Không có invalid ownership relationship.
- Các lỗi được chuẩn hóa theo D06.
- Các operation quan trọng được kiểm tra ở backend.

#### 14. Testing Requirements

**Unit Tests**

- Goal creation validation.
- Goal title validation.
- Goal update validation.
- Goal lifecycle transition validation.
- Parent–Child relationship validation.
- Self-reference validation.
- Circular reference detection.
- Workspace scope validation.
- Project scope validation.
- Goal placement validation.
- Goal hierarchy construction.
- Move precondition validation.

**Integration Tests**

- Create Independent Goal.
- Create Project-associated Goal.
- Retrieve Goal.
- List Goals by Workspace.
- List Goals by Project.
- Update Goal.
- Archive Goal.
- Retrieve Goal hierarchy.
- Add Child Goal.
- Add multiple hierarchy levels.
- Reject invalid Parent–Child relationships.
- Move Goal between supported scopes.
- Preserve related records during Move.
- Handle persistence failure during hierarchy changes.
- Handle concurrent hierarchy modifications.

**Security Tests**

- Unauthenticated Goal access.
- Invalid Goal ID.
- Forged Workspace ID.
- Forged Project ID.
- Forged Parent Goal ID.
- Cross-user Goal access.
- Cross-user Goal update.
- Cross-user hierarchy modification.
- Cross-user Move operation.
- Invalid destination access.
- AI proposal attempting to bypass authorization.

**End-to-End Tests**

1. Login → Create Independent Goal → Open Goal.
2. Login → Create Project → Create Goal inside Project.
3. Create Goal A → Add Child Goal B → Add Child Goal C → Retrieve Goal Tree.
4. Attempt to create circular hierarchy → Rejected.
5. Open Goal → Update title → Refresh → Updated information persists.
6. Archive Goal → Goal no longer appears in active list.
7. Move Goal to Project → Goal identity and related records remain intact.
8. User A → Attempt to retrieve User B's Goal → Rejected.
9. User A → Attempt to modify User B's Goal hierarchy → Rejected.
10. AI proposes Goal Tree → User approves → B03 creates approved Goal hierarchy.

#### 15. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Approve Goal Domain Model | Product Owner |
| 2 | Define Goal schema and relationships | D01 |
| 3 | Define Goal shared contracts | D03 |
| 4 | Define Workspace/Project validation contract | B02 |
| 5 | Implement Goal creation | B01, B02, D01 |
| 6 | Implement Goal retrieval and listing | D01 |
| 7 | Implement Goal update | D01, D04 |
| 8 | Implement Parent–Child validation | D01, D04 |
| 9 | Implement Child Goal creation | Previous steps |
| 10 | Implement Goal hierarchy retrieval | D01 |
| 11 | Approve and implement Goal lifecycle | Domain Model |
| 12 | Approve and implement Goal deletion | Domain Model, B04–B06 |
| 13 | Approve Move Goal transaction rules | B02, D01, B04–B06 |
| 14 | Implement Goal Move | Approved contracts |
| 15 | Integrate AI-approved Goal proposals | B10 |
| 16 | Run integration and security tests | Required modules |

Triển khai theo từng bước nhỏ.

Không implement Move hoặc destructive deletion khi các quy tắc liên quan vẫn OPEN.

Không cần xây dựng abstraction hoặc infrastructure không phục vụ trực tiếp MVP.

#### 16. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- AI Autonomous Goal Restructuring.
- Advanced Goal Recommendations.
- Goal Dependency Graph.
- Goal Templates.
- Goal Duplication.
- Goal Version History.
- Goal Collaboration.
- Shared Goal Ownership.
- Advanced Goal Analytics.
- Automatic Goal Adjustment.
- Advanced Goal Notification.
- Goal Import / Export.
- Goal Automation.
- Advanced Goal Scoring.
- Complex Goal Relationship Types.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

#### 17. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Goal Concept | APPROVED | Goal represents an Outcome |
| Goal Identity | APPROVED | Provider-independent Internal ID |
| Goal Ownership | APPROVED FOR MVP | Belongs to one Workspace |
| Project Relationship | APPROVED | Optional Project association |
| Independent Goal | APPROVED | Supported |
| Goal Hierarchy | APPROVED | Flexible-depth hierarchy |
| Parent Cardinality | APPROVED FOR DESIGN | Maximum one Parent Goal |
| Child Cardinality | APPROVED FOR DESIGN | Zero or many Child Goals |
| Circular Reference | APPROVED | Not allowed |
| Goal Tree | APPROVED | A view of Goal relationships |
| Goal Title | APPROVED | Required |
| Goal Description | APPROVED | Optional |
| Target Date | APPROVED | Optional |
| Goal Status Lifecycle | OPEN | Final transitions need approval |
| Goal Archive | APPROVED AS CAPABILITY | Detailed descendant rules OPEN |
| Goal Delete | OPEN | Hard/soft delete and dependency rules |
| Goal Restore | OPEN | Not required until lifecycle decision |
| Goal Move | APPROVED AT PRODUCT LEVEL | Workspace ↔ Project scope |
| Move Transaction Rules | OPEN | Must preserve all related data |
| Child Goal Independent Move | OPEN | Requires hierarchy policy |
| Descendant Move Behavior | OPEN | Requires explicit rule |
| Progress Calculation | B08 RESPONSIBILITY | Not calculated in B03 |
| Milestone Management | B04 RESPONSIBILITY | Not managed in B03 |
| Action Management | B05 RESPONSIBILITY | Not managed in B03 |
| Measurement Management | B06 RESPONSIBILITY | Not managed in B03 |
| AI Goal Proposal | B10 RESPONSIBILITY | Proposal must be approved by user |
| Database Technology | OPEN — D01 | Defined in D01 |
| API Contracts | OPEN — D03/D05 | Defined in shared contracts |

#### 18. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE FUNCTIONS / PARTIALLY BLOCKED

**Development Status:** AVAILABLE for core Goal operations once required contracts are available.

**Implementation Status:** NOT_STARTED

**Available Core Work:**

- Goal creation.
- Goal retrieval.
- Goal listing.
- Goal update.
- Basic Goal hierarchy.
- Child Goal creation.
- Parent–Child validation.
- Circular reference prevention.

**Blocked Work:**

- Final Goal lifecycle transitions.
- Destructive Goal deletion.
- Restore archived Goal.
- Advanced hierarchy restructuring.
- Goal Move transaction implementation.
- Child Goal movement between scopes.
- Descendant movement behavior.

**Remaining Dependencies:**

- B01: Provide authenticated Internal User Context.
- B02: Provide Workspace and Project ownership validation.
- B04: Provide Milestone relationship and lifecycle contracts.
- B05: Provide Action relationship and lifecycle contracts.
- B06: Provide Measurement relationship contracts.
- B08: Provide Progress data contracts.
- B09: Provide Review data contracts.
- B10: Provide approved AI proposal integration.
- D01: Provide Goal persistence and relational integrity.
- D03: Provide Goal and hierarchy shared types.
- D04: Provide validation.
- D05: Provide application communication conventions.
- D06: Provide shared error response conventions.
- D08: Provide security and ownership enforcement.

**Final Implementation Rule:** Build Goal Management as the authoritative owner of Goal entities and Goal hierarchy. Keep Goal separate from Milestone and Action. Preserve Goal identity and all valid related data during organizational changes. Never allow invalid hierarchy operations, circular references, unauthorized access or unapproved destructive operations. Do not introduce advanced Goal management features or unnecessary abstractions beyond FLOW-UP MVP.

### B04. Milestone Management

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED  
**Development Status:** PARTIALLY AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

#### 1. Purpose

B04 chịu trách nhiệm quản lý Milestone trong FLOW-UP.

Milestone đại diện cho một checkpoint quan trọng trên hành trình đạt được Goal. Nó giúp người dùng chia quá trình thực hiện Goal thành những mốc kết quả cụ thể để theo dõi.

B04 cung cấp các chức năng tạo, truy xuất, cập nhật và hoàn thành Milestone; đồng thời đảm bảo Milestone thuộc về một Goal hợp lệ và duy trì tính nhất quán trong quan hệ với Actions.

B04 chỉ quản lý Milestone. Không mở rộng thành hệ thống quản lý Goal, Action hoặc Progress độc lập.

#### 2. MVP Scope

**Included:**

- Milestone Creation.
- Milestone Retrieval.
- Milestone Update.
- Milestone Completion.
- Goal Ownership Validation.
- Milestone–Action Relationship Validation.
- Retrieve Milestones by Goal.
- Basic Milestone Status Management.
- Basic Milestone Error Handling.

**Excluded:**

- Goal Creation and Management.
- Goal Hierarchy Management.
- Action Creation and Management.
- Action Completion and Execution Tracking.
- Schedule and Daily Plan Management.
- Measurement Definition and Recording.
- Goal Progress Calculation.
- Automatic Progress Aggregation.
- Advanced Milestone Dependencies.
- Recurring Milestones.
- Advanced Notification and Reminder System.
- AI Autonomous Milestone Updates.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm thực sự có nhu cầu.

#### 3. Milestone Model

**Definition:**

Milestone là một checkpoint thuộc về một Goal, biểu thị một mốc quan trọng trên hành trình đạt được kết quả của Goal đó.

Ví dụ:

Goal: Improve IELTS Score

Milestones:
- Complete IELTS Listening Foundation.
- Reach Reading Band 6.0.
- Complete Writing Practice.
- Achieve Overall Band 7.0.

Milestone không đại diện cho công việc nhỏ cần thực hiện hằng ngày. Những công việc đó thuộc về Action.

**Logical Data Model:**

**Milestone**

| Field | Description |
|---|---|
| `id` | Milestone ID |
| `goal_id` | Owning Goal ID |
| `title` | Tên Milestone |
| `description` | Mô tả Milestone (optional) |
| `target_date` | Ngày dự kiến hoàn thành (optional) |
| `status` | Trạng thái Milestone |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật |
| `completed_at` | Thời điểm hoàn thành (optional) |

Đây là logical data model đề xuất cho thiết kế B04. Schema vật lý, kiểu dữ liệu chính thức và constraints được xác định trong D01 và Domain Model.

**Relationship:**

- Một Goal có thể có zero hoặc nhiều Milestones.
- Mỗi Milestone phải thuộc về một Goal.
- Một Milestone có thể liên kết với các Actions theo relationship model được phê duyệt.
- Action vẫn thuộc quyền quản lý của B05.
- Milestone không trực tiếp sở hữu hoặc quản lý dữ liệu thực thi của Action.

**Rules:**

- Milestone không tồn tại độc lập ngoài Goal.
- Không tạo Milestone nếu owning Goal không hợp lệ.
- Không sử dụng Milestone thay thế cho Child Goal.
- Không sử dụng Milestone thay thế cho Action.
- `goal_id` là tham chiếu đến Goal do B03 quản lý.
- Không tự tạo bản sao Goal hoặc Action bên trong Milestone.

#### 4. Milestone Status

B04 cần quản lý trạng thái cơ bản của Milestone.

**Proposed Status Model:**

| Status | Meaning |
|---|---|
| `PENDING` | Milestone chưa bắt đầu hoặc chưa hoàn thành |
| `COMPLETED` | Milestone đã được người dùng xác nhận hoàn thành |

**Proposed Transition:**

```text
PENDING ───────> COMPLETED
   ^                 |
   └─────────────────┘
       Reopen (OPEN)
```

**Rules:**

- Milestone mới được tạo có trạng thái `PENDING`.
- Người dùng có thể đánh dấu Milestone hoàn thành.
- Khi hoàn thành, hệ thống ghi nhận `completed_at`.
- Việc đánh dấu hoàn thành không tự động hoàn thành owning Goal.
- Không tự động hoàn thành Milestone chỉ vì tất cả Actions liên quan đã hoàn thành.
- Việc mở lại Milestone đã hoàn thành cần được xác định trong Domain Rules.

**OPEN:**

- Có cho phép reopen Milestone hay không.
- Có cần trạng thái `IN_PROGRESS` trong MVP hay không.
- Quy tắc cập nhật `completed_at` khi reopen.
- Cách xử lý khi owning Goal được archive hoặc delete.

Các trạng thái trên là đề xuất thiết kế, chưa được xem là quyết định Domain đã phê duyệt.

#### 5. Core Functions

##### B04.1. Create Milestone

**Purpose:** Tạo Milestone mới cho một Goal.

**Input:**

- `goal_id`
- `title`
- `description` (optional)
- `target_date` (optional)

**Processing:**

1. Nhận thông tin tạo Milestone.
2. Validate input thông qua D04.
3. Resolve authenticated User Context.
4. Kiểm tra owning Goal thông qua B03.
5. Xác nhận người dùng có quyền truy cập Goal đó.
6. Kiểm tra các quy tắc liên quan đến trạng thái Goal.
7. Khởi tạo Milestone với trạng thái mặc định.
8. Persist Milestone thông qua D01.
9. Trả Milestone vừa tạo.

**Expected Results:**

- Milestone created successfully.
- Invalid input.
- Owning Goal not found.
- User does not own the Goal.
- Goal is not eligible for new Milestone.
- Persistence error.

**Rules:**

- `goal_id` là bắt buộc.
- Không tạo Milestone nếu Goal không tồn tại.
- Không tạo Milestone cho Goal thuộc người dùng khác.
- Title không được để trống.
- Không tự động tạo Action khi tạo Milestone.
- Không tự động thay đổi Goal status.

##### B04.2. Get Milestone

**Purpose:** Truy xuất chi tiết một Milestone.

**Input:**

- `milestone_id`

**Processing:**

1. Nhận Milestone ID.
2. Resolve authenticated User Context.
3. Truy vấn Milestone.
4. Kiểm tra quyền truy cập thông qua owning Goal.
5. Trả thông tin Milestone.

**Expected Results:**

- Milestone found.
- Milestone not found.
- Access denied.
- Persistence error.

**Rules:**

- Không trả dữ liệu Milestone của người dùng khác.
- Không trả thông tin Action ngoài phạm vi được phép.
- Nếu cần hiển thị Actions liên quan, sử dụng dữ liệu từ B05.

##### B04.3. List Milestones by Goal

**Purpose:** Truy xuất danh sách Milestones thuộc một Goal.

**Input:**

- `goal_id`

**Processing:**

1. Nhận Goal ID.
2. Kiểm tra quyền truy cập Goal thông qua B03.
3. Truy vấn các Milestones thuộc Goal.
4. Áp dụng quy tắc hiển thị theo trạng thái nếu được yêu cầu.
5. Trả danh sách Milestones.

**Expected Results:**

- Milestone list returned.
- Empty list.
- Goal not found.
- Access denied.

**Rules:**

- Chỉ trả Milestones thuộc Goal được yêu cầu.
- Không trộn Milestones giữa các Goal.
- Không tự động tính Goal progress.
- Thứ tự hiển thị mặc định cần được xác định trong UI/UX hoặc Domain Rules.

##### B04.4. Update Milestone

**Purpose:** Cập nhật thông tin Milestone.

**Input:**

- `milestone_id`
- `title` (optional)
- `description` (optional)
- `target_date` (optional)

**Processing:**

1. Nhận yêu cầu cập nhật.
2. Validate input.
3. Truy xuất Milestone.
4. Kiểm tra quyền truy cập thông qua owning Goal.
5. Kiểm tra trạng thái hiện tại và các quy tắc chỉnh sửa.
6. Cập nhật những trường được phép.
7. Persist thay đổi.
8. Trả Milestone đã cập nhật.

**Expected Results:**

- Milestone updated successfully.
- Milestone not found.
- Access denied.
- Invalid input.
- Update not allowed.
- Persistence error.

**Rules:**

- Không cho phép thay đổi `id`.
- Không cho phép thay đổi `goal_id` thông qua thao tác update thông thường.
- Không ghi đè các trường không được cung cấp.
- Không tự động thay đổi trạng thái Milestone khi cập nhật nội dung.
- Quy tắc chỉnh sửa Milestone đã hoàn thành cần được xác định.

##### B04.5. Complete Milestone

**Purpose:** Đánh dấu Milestone đã hoàn thành.

**Input:**

- `milestone_id`

**Processing:**

1. Nhận yêu cầu hoàn thành.
2. Truy xuất Milestone.
3. Kiểm tra quyền truy cập.
4. Kiểm tra trạng thái hiện tại.
5. Validate điều kiện hoàn thành.
6. Chuyển trạng thái sang `COMPLETED`.
7. Ghi nhận `completed_at`.
8. Persist thay đổi.
9. Trả kết quả.

**Expected Results:**

- Milestone completed successfully.
- Milestone not found.
- Access denied.
- Completion not allowed.
- Already completed.
- Persistence error.

**Rules:**

- Chỉ người dùng có quyền truy cập Milestone mới được hoàn thành.
- Hoàn thành Milestone không đồng nghĩa hoàn thành Goal.
- Không tự động hoàn thành các Milestones khác.
- Không tự động complete các Actions liên quan.
- Không thực hiện Progress Calculation trong B04.
- Thao tác lặp lại phải được xử lý an toàn, không tạo thêm bản ghi hoặc tác dụng phụ không cần thiết.

#### 6. Milestone–Goal Relationship

**Purpose:** Đảm bảo mỗi Milestone thuộc về một Goal hợp lệ.

**Relationship:**

```text
Workspace
   |
   └── Goal
         |
         ├── Milestone A
         |      |
         |      └── Related Actions
         |
         ├── Milestone B
         |      |
         |      └── Related Actions
         |
         └── Milestone C
                |
                └── Related Actions
```

**Rules:**

1. Mỗi Milestone phải có một owning Goal.
2. Owning Goal phải tồn tại.
3. Người dùng phải có quyền truy cập owning Goal.
4. Không tạo Milestone cho Goal thuộc người dùng khác.
5. Không cho phép Milestone tham chiếu đến Goal không hợp lệ.
6. Không tự động chuyển Milestone sang Goal khác.
7. Không tự động xóa Milestone khi Goal thay đổi nếu chưa có quy tắc được phê duyệt.

**Integration with B03:**

- B03 là nguồn dữ liệu chính thức cho Goal.
- B04 sử dụng B03 để kiểm tra Goal tồn tại và quyền truy cập.
- B04 không sửa Goal trực tiếp.
- Các thay đổi về Goal lifecycle phải được B03 thông báo hoặc xử lý thông qua application workflow phù hợp.

**OPEN:**

- Có cho phép tạo Milestone khi Goal đã `COMPLETED` hay không.
- Khi Goal bị archive, Milestones được giữ nguyên, archive theo hay bị hạn chế truy cập.
- Khi Goal bị delete, xử lý Milestones theo chính sách delete của B03.

#### 7. Milestone–Action Relationship

**Purpose:** Duy trì quan hệ hợp lệ giữa Milestone và các Actions liên quan.

Actions mô tả công việc người dùng thực hiện. Milestones mô tả checkpoint mà những công việc đó hướng tới.

**Example:**

```text
Goal: Improve IELTS Score
   |
   └── Milestone: Reach Reading Band 6.0
          |
          ├── Action: Complete Reading Test 01
          ├── Action: Review Reading Mistakes
          └── Action: Complete Reading Test 02
```

**Ownership Boundaries:**

| Responsibility | Owner |
|---|---|
| Create and update Milestone | B04 |
| Validate owning Goal | B04 through B03 |
| Create and update Action | B05 |
| Complete Action | B05 |
| Validate Action–Goal association | B05 |
| Validate Action–Milestone association | B05 and B04 under agreed contract |
| Calculate Goal progress | B08 |

**Rules:**

- B04 không tạo hoặc cập nhật Action.
- B04 không quản lý Action status.
- B04 không quản lý Action execution data.
- Action phải tham chiếu đến Milestone hợp lệ nếu được liên kết với Milestone.
- Milestone và Action phải thuộc cùng một phạm vi Goal hợp lệ.
- Không cho phép liên kết Action của Goal khác vào Milestone nếu không có quy tắc chuyển đổi được phê duyệt.
- Thao tác liên kết hoặc gỡ liên kết Action phải được thực hiện thông qua application contract của B05/B04, không sửa dữ liệu trực tiếp từ UI.

**OPEN — Relationship Cardinality:**

Master Blueprint chưa quyết định chính xác cardinality của Action–Goal và Action–Milestone.

Các câu hỏi cần chốt:

- Một Milestone có thể liên kết với nhiều Actions không?
- Một Action có thể liên kết với nhiều Milestones không?
- Action có bắt buộc phải thuộc Milestone hay có thể liên kết trực tiếp với Goal?
- Nếu một Action đổi Milestone, quy tắc kiểm tra và cập nhật quan hệ là gì?

Không triển khai các constraints về cardinality trước khi quyết định này được phê duyệt.

#### 8. Application Operations

B04 cung cấp các thao tác logic sau:

| Operation | Purpose |
|---|---|
| `createMilestone(input)` | Tạo Milestone |
| `getMilestone(milestoneId)` | Lấy chi tiết Milestone |
| `listMilestonesByGoal(goalId)` | Lấy Milestones theo Goal |
| `updateMilestone(milestoneId, input)` | Cập nhật Milestone |
| `completeMilestone(milestoneId)` | Hoàn thành Milestone |
| `validateOwningGoal(goalId, userId)` | Kiểm tra Goal hợp lệ và quyền truy cập |
| `validateMilestoneActionRelation(milestoneId, actionId)` | Kiểm tra quan hệ Milestone–Action |

Đây là các thao tác ở cấp kiến trúc, chưa phải HTTP endpoint cuối cùng.

Chi tiết implementation phụ thuộc vào backend framework, application contract và persistence layer được lựa chọn.

#### 9. Error Handling

B04 cần xử lý các lỗi cơ bản:

| Error Code | Meaning |
|---|---|
| `MILESTONE_NOT_FOUND` | Không tìm thấy Milestone |
| `MILESTONE_ACCESS_DENIED` | Không có quyền truy cập Milestone |
| `MILESTONE_INVALID_TITLE` | Title không hợp lệ |
| `MILESTONE_INVALID_INPUT` | Dữ liệu đầu vào không hợp lệ |
| `MILESTONE_GOAL_NOT_FOUND` | Không tìm thấy owning Goal |
| `MILESTONE_GOAL_ACCESS_DENIED` | Không có quyền truy cập owning Goal |
| `MILESTONE_GOAL_INVALID` | Owning Goal không hợp lệ |
| `MILESTONE_ACTION_NOT_FOUND` | Không tìm thấy Action liên quan |
| `MILESTONE_ACTION_RELATION_INVALID` | Quan hệ Milestone–Action không hợp lệ |
| `MILESTONE_ALREADY_COMPLETED` | Milestone đã hoàn thành |
| `MILESTONE_COMPLETION_NOT_ALLOWED` | Không được phép hoàn thành Milestone |
| `MILESTONE_UPDATE_NOT_ALLOWED` | Không được phép cập nhật Milestone |
| `MILESTONE_PERSISTENCE_ERROR` | Lỗi lưu dữ liệu |
| `MILESTONE_UNKNOWN_ERROR` | Lỗi không xác định |

**Rules:**

- Không trả trực tiếp lỗi database hoặc lỗi nội bộ của module khác cho frontend.
- Sử dụng quy ước error response chung của D06.
- Không để lộ dữ liệu của người dùng khác trong error response.
- Phân biệt Not Found và Access Denied theo chính sách bảo mật chung của ứng dụng.
- Không ghi thông tin nhạy cảm không cần thiết vào log.

#### 10. Dependencies

| Dependency | Purpose |
|---|---|
| B01 — Authentication & User Context | Resolve authenticated User Context |
| B03 — Goal Management | Validate owning Goal and ownership |
| B05 — Action Management | Maintain Action relationship |
| C01 — Identity & Ownership Rules | User ownership rules |
| C04 — Milestone Rules | Milestone business invariants |
| C05 — Action Rules | Action relationship rules |
| D01 — Database & Persistence | Store Milestone data |
| D03 — Shared Types & Contracts | Shared types and identifiers |
| D04 — Validation | Validate input and domain constraints |
| D06 — Error Handling | Normalize errors |
| D07 — Logging & Observability | Record operational errors |
| D08 — Security & Configuration | Protect user-owned data |
| B08 — Progress Engine | Consume Milestone-related information where required |

**Integration Rules:**

- B04 sử dụng User Context từ B01.
- B04 sử dụng B03 để xác thực owning Goal.
- B04 phối hợp với B05 để duy trì quan hệ Action.
- B04 sử dụng D01 để lưu và truy xuất Milestone.
- B04 sử dụng D03, D04 và D06 theo shared contracts.
- B08 có thể đọc dữ liệu Milestone khi triển khai các quy tắc progress đã được phê duyệt.
- B04 không gọi trực tiếp AI Provider.
- B04 không phụ thuộc vào UI component.

#### 11. Security Requirements

MVP yêu cầu các biện pháp bảo vệ cơ bản:

- Người dùng phải được xác thực trước khi truy cập Milestone cá nhân.
- Mọi thao tác phải kiểm tra quyền truy cập owning Goal.
- Không tin tưởng `user_id` do frontend tự gửi.
- Không cho phép truy cập Milestone thuộc Goal của người dùng khác.
- Không cho phép liên kết Action thuộc phạm vi không hợp lệ.
- Backend phải thực hiện ownership validation.
- Database phải duy trì foreign key và constraints phù hợp.
- Không để frontend tự quyết định quyền truy cập.
- Không để lộ dữ liệu cá nhân trong error response hoặc log.

Không xây dựng hệ thống permission phức tạp ngoài nhu cầu MVP.

#### 12. Acceptance Criteria

B04 được xem là đạt yêu cầu MVP khi:

**Milestone Creation**

- Người dùng tạo được Milestone cho Goal hợp lệ.
- Không tạo được Milestone khi thiếu owning Goal.
- Goal không tồn tại bị từ chối.
- Không tạo được Milestone thuộc Goal của người dùng khác.
- Title không hợp lệ bị từ chối.
- Milestone mới có trạng thái mặc định đúng theo Domain Rules.

**Milestone Retrieval**

- Người dùng lấy được chi tiết Milestone.
- Người dùng lấy được danh sách Milestones theo Goal.
- Goal không có Milestone trả về danh sách rỗng.
- Không thể truy cập Milestone của người dùng khác.

**Milestone Update**

- Người dùng cập nhật được các trường được phép.
- Không thay đổi được Milestone ID.
- Không thể thay đổi owning Goal thông qua update thông thường.
- Dữ liệu không hợp lệ bị từ chối.

**Milestone Completion**

- Người dùng đánh dấu Milestone hoàn thành được.
- Trạng thái được cập nhật chính xác.
- `completed_at` được ghi nhận đúng.
- Không tự động complete owning Goal.
- Không tự động complete các Actions liên quan.
- Thao tác lặp lại được xử lý an toàn.

**Relationships**

- Milestone luôn tham chiếu đến Goal hợp lệ.
- Quan hệ Milestone–Action được kiểm tra theo rules đã phê duyệt.
- Không thể liên kết dữ liệu thuộc phạm vi người dùng khác.
- Không có dữ liệu Goal hoặc Action bị sao chép vào Milestone.

#### 13. Testing Requirements

**Unit Tests**

- Milestone input validation.
- Milestone title validation.
- Owning Goal validation.
- Milestone status transition.
- Completion timestamp handling.
- Milestone–Action relationship validation.
- Ownership validation.

**Integration Tests**

- Create Milestone with valid Goal.
- Create Milestone with invalid Goal.
- Retrieve Milestone.
- List Milestones by Goal.
- Update Milestone.
- Complete Milestone.
- Persist and retrieve Milestone status.
- Integrate with B03 Goal retrieval.
- Integrate with B05 Action relationship contract.

**Security Tests**

- Unauthenticated Milestone access.
- Invalid User Context.
- User A attempts to retrieve User B's Milestone.
- User A attempts to update User B's Milestone.
- User A attempts to complete User B's Milestone.
- Attempt to associate an Action from an unauthorized Goal.

**End-to-End Tests**

1. Login → Open Goal → Create Milestone → Retrieve Milestone.
2. Login → Open Goal → Create Milestone → Update Milestone.
3. Login → Open Goal → Create Milestone → Complete Milestone.
4. Login → Open Goal → View Milestones → Open associated Action.
5. User A → Attempt to access User B's Milestone → Rejected.

#### 14. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Confirm Milestone Domain Model | C04 |
| 2 | Define Milestone schema and constraints | D01 |
| 3 | Define shared Milestone types | D03 |
| 4 | Implement input validation | D04 |
| 5 | Implement owning Goal validation | B03 |
| 6 | Implement Create Milestone | D01, B03 |
| 7 | Implement Get and List Milestones | D01, B03 |
| 8 | Implement Update Milestone | D01, B03 |
| 9 | Implement Complete Milestone | C04, D01 |
| 10 | Define Action relationship contract | B05, C05 |
| 11 | Implement relationship validation | B05, C04 |
| 12 | Run integration and security tests | Required dependencies |

Triển khai theo từng bước nhỏ. Không xây dựng thêm workflow hoặc abstraction không phục vụ trực tiếp MVP.

#### 15. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Milestone Dependencies.
- Nested Milestones.
- Recurring Milestones.
- Advanced Milestone Templates.
- Milestone Notifications.
- Automatic Milestone Scheduling.
- Automatic Milestone Completion.
- Advanced Milestone Analytics.
- AI-generated Milestone Optimization.
- AI Autonomous Milestone Updates.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

#### 16. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Milestone Purpose | APPROVED BY BLUEPRINT | Goal checkpoint |
| Milestone Ownership | APPROVED BY BLUEPRINT | Each Milestone belongs to one Goal |
| Goal–Milestone Cardinality | APPROVED BY BLUEPRINT | One Goal may have zero or more Milestones |
| Milestone Core Operations | APPROVED BY BLUEPRINT | Create, retrieve, update, complete |
| Owning Goal Validation | REQUIRED | B04 validates through B03 |
| Action Management | B05 OWNERSHIP | B04 does not manage Actions |
| Action–Milestone Cardinality | OPEN | Must be decided in Domain Model |
| Milestone Status Values | PROPOSED | PENDING / COMPLETED |
| Reopen Behavior | OPEN | Requires Domain decision |
| Goal Archive/Delete Effects | OPEN | Coordinate with B03 lifecycle rules |
| Automatic Goal Completion | NOT INCLUDED | B04 does not complete Goal automatically |
| Automatic Action Completion | NOT INCLUDED | B04 does not complete Actions automatically |
| Progress Calculation | B08 OWNERSHIP | B04 does not calculate progress |
| Database Technology | OPEN — D01 | Defined in D01 |
| API Contract | OPEN — D05 | Defined in D05 |

#### 17. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED

**Development Status:** PARTIALLY AVAILABLE

**Implementation Status:** NOT_STARTED

**Core Functions Available for Implementation:**

- Create Milestone.
- Get Milestone.
- List Milestones by Goal.
- Update Milestone.
- Complete Milestone.
- Basic owning Goal validation.

Các chức năng trên có thể triển khai sau khi B03 và các persistence/shared contracts cần thiết được cung cấp.

**Remaining Dependencies:**

- B03: Goal retrieval and ownership validation contract.
- B05: Action relationship contract.
- C04: Final Milestone business rules.
- C05: Action relationship rules.
- D01: Milestone persistence schema.
- D03: Shared types and identifiers.
- D04: Validation contract.
- D06: Error response contract.
- D08: Security and configuration.

**Implementation Restrictions:**

- Không tự triển khai Goal Management bên trong B04.
- Không tự triển khai Action Management bên trong B04.
- Không tự quyết định Action–Milestone cardinality.
- Không tự thêm status chưa được phê duyệt vào Domain Model.
- Không tự động complete Goal hoặc Action.
- Không triển khai Progress Calculation trong B04.
- Không invent file paths trước khi repository structure và technology stack được phê duyệt.

**Final Implementation Rule:**

Build only the Milestone Management functionality required by FLOW-UP MVP. Keep Milestone as a Goal checkpoint, preserve clear ownership boundaries between B03, B04, and B05, and avoid introducing unapproved business rules or unnecessary abstractions.
### B05. Action Management

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED  
**Development Status:** PARTIALLY AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

#### 1. Purpose

B05 chịu trách nhiệm quản lý Actions trong FLOW-UP.

Action là một đơn vị công việc cụ thể mà người dùng thực hiện để tiến gần hơn đến kết quả của Goal hoặc hoàn thành một Milestone.

B05 cung cấp các chức năng tạo, truy xuất, cập nhật, hoàn thành và archive/delete Actions theo các quy tắc được phê duyệt.

Ngoài ra, B05 chịu trách nhiệm ghi nhận dữ liệu thực thi cần thiết để B07 Planning & Scheduling và B09 Review có thể sử dụng.

B05 chỉ quản lý Action và dữ liệu thực thi. Không mở rộng thành hệ thống Goal Management, Milestone Management, Planning hoặc Progress Calculation.

#### 2. MVP Scope

**Included:**

- Action Creation.
- Action Retrieval.
- Action Update.
- Action Completion.
- Action Status Management.
- Action Archive/Delete under approved rules.
- Goal Association Validation.
- Milestone Association Validation.
- List Actions by Goal.
- List Actions by Milestone.
- Record Actual Execution Data.
- Retrieve Action Execution Data.
- Basic Action Error Handling.
- Provide Action Data to Planning and Review.

**Excluded:**

- Goal Creation and Management.
- Milestone Creation and Management.
- Goal Hierarchy Management.
- Measurement Definition and Recording.
- Daily Plan Management.
- Schedule Creation and Management.
- Calendar Management.
- Goal Progress Calculation.
- Milestone Progress Calculation.
- Automatic Action Generation.
- Automatic Action Completion.
- Advanced Recurring Actions.
- Team Assignment and Collaboration.
- Advanced Task Dependencies.
- AI Autonomous Action Updates.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm thực sự có nhu cầu.

#### 3. Action Model

**Definition:**

Action là một đơn vị công việc cụ thể có thể được lập kế hoạch và thực hiện.

Action tập trung vào câu hỏi:

"What should I do?"

Ví dụ:

Goal: Improve IELTS Score

Milestone: Reach Reading Band 6.0

Actions:
- Complete Reading Practice Test 01.
- Review mistakes from Practice Test 01.
- Learn 30 new vocabulary words.
- Complete Reading Practice Test 02.

**Conceptual Distinction:**

| Entity | Meaning | Example |
|---|---|---|
| Goal | Outcome to achieve | Improve IELTS Score |
| Milestone | Important checkpoint | Reach Reading Band 6.0 |
| Action | Concrete work to perform | Complete Reading Test 01 |
| Schedule | Planned time for an Action | 19:00–20:00 Monday |

Actions are execution-level items and are not further decomposed into Goal nodes in the MVP.

**Logical Data Model:**

**Action**

| Field | Description |
|---|---|
| `id` | Action ID |
| `goal_id` | Associated Goal ID |
| `milestone_id` | Associated Milestone ID (optional, subject to relationship decision) |
| `title` | Action title |
| `description` | Action description (optional) |
| `status` | Current Action status |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |
| `completed_at` | Completion timestamp (optional) |
| `archived_at` | Archive timestamp (optional) |

**Action Execution Data**

| Field | Description |
|---|---|
| `action_id` | Associated Action ID |
| `actual_started_at` | Actual start timestamp (optional) |
| `actual_completed_at` | Actual completion timestamp (optional) |
| `actual_duration_minutes` | Actual execution duration (optional) |
| `execution_note` | Optional execution note |

Đây là logical data model đề xuất. Việc lưu execution data trực tiếp trong Action hay sử dụng một entity riêng cần được xác định trong Domain Model và D01.

**Rules:**

- Action phải liên kết với một Goal hoặc Milestone hợp lệ.
- Action không phải là Goal.
- Action không phải là Milestone.
- Action không tự quản lý lịch thực hiện.
- Action không tự tính toán Goal Progress.
- Action status và execution data phải được lưu nhất quán.
- Không tạo bản sao Action trong Planning hoặc Calendar.

#### 4. Action Status

B05 quản lý trạng thái thực thi của Action.

**Proposed Status Model:**

| Status | Meaning |
|---|---|
| `TODO` | Action chưa được thực hiện |
| `IN_PROGRESS` | Action đang được thực hiện |
| `COMPLETED` | Action đã hoàn thành |

**Proposed Transition:**

```text
TODO ─────────> IN_PROGRESS
 |                  |
 |                  |
 └──────────────> COMPLETED
                    |
                    v
             Reopen (OPEN)
```

**Rules:**

- Action mới được tạo có trạng thái mặc định `TODO`.
- Người dùng có thể chuyển Action sang `IN_PROGRESS`.
- Người dùng có thể đánh dấu Action là `COMPLETED`.
- Khi hoàn thành, hệ thống ghi nhận `completed_at`.
- Không tự động chuyển Action sang `COMPLETED` chỉ vì thời gian Schedule kết thúc.
- Không tự động hoàn thành owning Goal hoặc Milestone.
- Reopen Action cần được xác định trong Domain Rules.

**OPEN:**

- Có cho phép reopen Action không?
- Khi reopen, `completed_at` được xử lý như thế nào?
- Có cần trạng thái `CANCELLED` không?
- Có cho phép hoàn thành trực tiếp Action từ `TODO` không?
- Action đã hoàn thành có được phép chỉnh sửa nội dung không?

Các trạng thái đề xuất chưa được xem là quyết định Domain chính thức.

#### 5. Core Functions

##### B05.1. Create Action

**Purpose:** Tạo Action mới cho Goal hoặc Milestone.

**Input:**

- `goal_id` (required theo logical model đề xuất).
- `milestone_id` (optional, subject to relationship decision).
- `title`.
- `description` (optional).

**Processing:**

1. Nhận thông tin tạo Action.
2. Validate input thông qua D04.
3. Resolve authenticated User Context.
4. Validate Goal association thông qua B03.
5. Nếu có Milestone ID, validate Milestone association thông qua B04.
6. Kiểm tra quan hệ giữa Goal và Milestone.
7. Kiểm tra trạng thái của các entity liên quan.
8. Khởi tạo Action với trạng thái mặc định.
9. Persist Action thông qua D01.
10. Trả Action vừa tạo.

**Expected Results:**

- Action created successfully.
- Invalid input.
- Goal not found.
- Milestone not found.
- Association invalid.
- Access denied.
- Persistence error.

**Rules:**

- Title không được để trống.
- Không tạo Action cho Goal không tồn tại.
- Không tạo Action thuộc Goal của người dùng khác.
- Nếu Action có Milestone, Milestone phải thuộc Goal tương ứng theo relationship rules.
- Không tự động tạo Schedule khi tạo Action.
- Không tự động tạo Daily Plan.
- Không tự động thay đổi Goal hoặc Milestone status.

##### B05.2. Get Action

**Purpose:** Truy xuất chi tiết một Action.

**Input:**

- `action_id`.

**Processing:**

1. Nhận Action ID.
2. Resolve authenticated User Context.
3. Truy vấn Action.
4. Validate quyền truy cập thông qua Goal/Milestone association.
5. Truy xuất execution data nếu có.
6. Trả thông tin Action.

**Expected Results:**

- Action found.
- Action not found.
- Access denied.
- Persistence error.

**Rules:**

- Không trả Action thuộc dữ liệu người dùng khác.
- Không trả Schedule như dữ liệu thuộc sở hữu của B05.
- Nếu cần thông tin Schedule, sử dụng contract của B07.
- Không tính toán Goal Progress trong thao tác này.

##### B05.3. List Actions by Goal

**Purpose:** Truy xuất các Actions liên quan đến một Goal.

**Input:**

- `goal_id`.

**Processing:**

1. Nhận Goal ID.
2. Validate Goal ownership thông qua B03.
3. Truy vấn các Actions liên quan.
4. Áp dụng filter theo status nếu được yêu cầu.
5. Trả danh sách Actions.

**Expected Results:**

- Action list returned.
- Empty list.
- Goal not found.
- Access denied.

**Rules:**

- Chỉ trả Actions thuộc Goal được yêu cầu.
- Không trộn dữ liệu giữa các Goal.
- Không tự động tính progress.
- Không trả các Actions đã archive trong danh sách active mặc định.

##### B05.4. List Actions by Milestone

**Purpose:** Truy xuất các Actions liên quan đến một Milestone.

**Input:**

- `milestone_id`.

**Processing:**

1. Nhận Milestone ID.
2. Validate Milestone thông qua B04.
3. Truy vấn các Actions liên quan.
4. Validate relationship.
5. Trả danh sách Actions.

**Expected Results:**

- Action list returned.
- Empty list.
- Milestone not found.
- Access denied.
- Invalid relationship.

**Rules:**

- Chỉ trả Actions có quan hệ hợp lệ với Milestone.
- Không truy xuất Actions thuộc Milestone khác.
- Không tạo bản sao Action khi truy xuất theo Milestone.

##### B05.5. Update Action

**Purpose:** Cập nhật thông tin Action.

**Input:**

- `action_id`.
- `title` (optional).
- `description` (optional).
- Association changes (optional, subject to approved rules).

**Processing:**

1. Nhận yêu cầu cập nhật.
2. Validate input.
3. Truy xuất Action.
4. Kiểm tra quyền truy cập.
5. Kiểm tra trạng thái Action.
6. Nếu có thay đổi association, validate Goal/Milestone relationship.
7. Cập nhật các trường được phép.
8. Persist thay đổi.
9. Trả Action đã cập nhật.

**Expected Results:**

- Action updated successfully.
- Action not found.
- Access denied.
- Invalid input.
- Invalid association.
- Update not allowed.
- Persistence error.

**Rules:**

- Không cho phép thay đổi Action ID.
- Không ghi đè các trường không được cung cấp.
- Không tự động thay đổi Action status khi cập nhật nội dung.
- Thay đổi Goal/Milestone association phải tuân theo Domain Rules.
- Không trực tiếp sửa Schedule thuộc B07.

##### B05.6. Update Action Status

**Purpose:** Cập nhật trạng thái thực thi của Action.

**Input:**

- `action_id`.
- `status`.

**Processing:**

1. Nhận Action ID và trạng thái mới.
2. Truy xuất Action.
3. Kiểm tra quyền truy cập.
4. Validate trạng thái mới.
5. Kiểm tra trạng thái hiện tại.
6. Validate status transition.
7. Cập nhật trạng thái.
8. Ghi nhận timestamp phù hợp.
9. Persist thay đổi.
10. Trả kết quả.

**Expected Results:**

- Action status updated.
- Action not found.
- Access denied.
- Invalid status.
- Invalid status transition.
- Update not allowed.

**Rules:**

- Chỉ cho phép các trạng thái được Domain Model phê duyệt.
- Không cho phép chuyển trạng thái tùy ý.
- Khi chuyển sang `COMPLETED`, ghi nhận `completed_at`.
- Không tự động complete Milestone.
- Không tự động complete Goal.
- Không tự động xóa Schedule.
- Thao tác lặp lại phải được xử lý an toàn.

##### B05.7. Complete Action

**Purpose:** Đánh dấu Action đã hoàn thành.

**Input:**

- `action_id`.
- `execution_note` (optional).

**Processing:**

1. Nhận yêu cầu hoàn thành.
2. Truy xuất Action.
3. Validate quyền truy cập.
4. Kiểm tra trạng thái hiện tại.
5. Validate điều kiện hoàn thành.
6. Chuyển trạng thái sang `COMPLETED`.
7. Ghi nhận `completed_at`.
8. Ghi nhận execution data được cung cấp.
9. Persist thay đổi.
10. Trả kết quả.

**Expected Results:**

- Action completed successfully.
- Action not found.
- Access denied.
- Already completed.
- Completion not allowed.
- Persistence error.

**Rules:**

- Chỉ người dùng có quyền truy cập Action mới được hoàn thành.
- Completion phải cập nhật trạng thái một cách nhất quán.
- Không tự động hoàn thành các Actions liên quan.
- Không tự động hoàn thành Milestone.
- Không tự động hoàn thành Goal.
- Không yêu cầu Schedule tồn tại mới cho phép hoàn thành Action.
- Không giả định thời điểm hoàn thành là thời điểm Schedule kết thúc.

##### B05.8. Archive/Delete Action

**Purpose:** Quản lý việc ngừng sử dụng hoặc xóa Action theo các quy tắc được phê duyệt.

**Input:**

- `action_id`.
- Operation: `archive` hoặc `delete`.

**Processing:**

1. Nhận yêu cầu archive/delete.
2. Truy xuất Action.
3. Kiểm tra quyền truy cập.
4. Kiểm tra các quan hệ với Goal, Milestone, Schedule và Review.
5. Kiểm tra chính sách archive/delete.
6. Thực hiện thao tác được phép.
7. Persist thay đổi.
8. Trả kết quả.

**Rules:**

- Archive và Delete là hai thao tác khác nhau.
- Không xóa Action nếu việc đó làm mất dữ liệu cần thiết cho Review hoặc lịch sử thực thi mà chưa có chính sách xử lý.
- Không tự ý xóa Schedule thuộc B07.
- Không tự ý xóa dữ liệu Review thuộc B09.
- Action đã archive không xuất hiện trong danh sách active mặc định.
- Không tự động archive các Actions khác.

**OPEN:**

- Archive có giữ nguyên execution history không?
- Delete là hard delete hay soft delete?
- Có bắt buộc archive trước khi delete không?
- Action đang được Schedule tham chiếu có được delete không?
- Action đã hoàn thành có được delete không?
- Có cần cho phép restore Action đã archive không?

Không triển khai destructive delete trước khi các quyết định trên được phê duyệt.

##### B05.9. Record Action Execution

**Purpose:** Ghi nhận dữ liệu thực tế của quá trình thực hiện Action.

Dữ liệu này được sử dụng bởi Planning và Review.

**Input:**

- `action_id`.
- `actual_started_at` (optional).
- `actual_completed_at` (optional).
- `actual_duration_minutes` (optional).
- `execution_note` (optional).

**Processing:**

1. Nhận thông tin execution.
2. Truy xuất Action.
3. Validate quyền truy cập.
4. Validate dữ liệu thời gian và duration.
5. Kiểm tra tính nhất quán với Action status.
6. Ghi nhận execution data.
7. Persist dữ liệu.
8. Trả execution result.

**Expected Results:**

- Execution data recorded.
- Action not found.
- Access denied.
- Invalid execution data.
- Invalid time range.
- Persistence error.

**Rules:**

- Execution data mô tả điều thực tế đã xảy ra, không phải kế hoạch.
- Không dùng planned date/time thay thế cho actual execution time.
- Không ghi nhận thời gian thực tế dựa trên giả định nếu người dùng không cung cấp hoặc hệ thống không có dữ liệu đáng tin cậy.
- Không cho phép duration âm.
- Nếu có cả actual start và actual completion, completion không được sớm hơn start.
- Việc cập nhật execution data phải tuân theo lịch sử và audit rules được phê duyệt.
- Không tự động thay đổi Schedule.
- Không thực hiện Review trong B05.

**OPEN:**

- Execution data có cần lưu lịch sử nhiều lần thực hiện không?
- Một Action có thể được thực hiện qua nhiều sessions không?
- Có cần ghi nhận partial execution không?
- Có cần lưu actual duration tự động từ timer không?

MVP có thể bắt đầu với dữ liệu thực thi cơ bản, nhưng không nên giả định một Action chỉ có một execution session nếu Domain Model chưa phê duyệt.

#### 6. Goal–Action Relationship

**Purpose:** Đảm bảo Action liên kết với Goal phù hợp.

**Rules:**

1. Action phải liên kết với một Goal hoặc một Milestone hợp lệ.
2. Goal phải tồn tại.
3. Người dùng phải có quyền truy cập Goal.
4. Không liên kết Action với Goal thuộc người dùng khác.
5. Action không được trở thành một Goal con.
6. Action không được tạo vòng tham chiếu trong Goal hierarchy.
7. Việc thay đổi Goal association phải tuân theo quy tắc Domain.

**Integration with B03:**

- B03 là nguồn dữ liệu chính thức của Goal.
- B05 sử dụng B03 để validate Goal.
- B05 không tạo hoặc sửa Goal.
- B05 không thay đổi Goal hierarchy.
- Khi Goal bị archive, delete hoặc move, B05 phải tuân theo lifecycle và movement rules được B03 phê duyệt.

**OPEN:**

- Một Action có thể liên kết với nhiều Goals không?
- Một Action có thể chuyển từ Goal này sang Goal khác không?
- Khi Goal bị archive hoặc delete, Action được xử lý thế nào?
- Action thuộc Goal có được truy cập khi Goal đã completed không?

#### 7. Milestone–Action Relationship

**Purpose:** Đảm bảo Action được liên kết với Milestone phù hợp.

**Rules:**

- Nếu Action liên kết với Milestone, Milestone phải tồn tại.
- Người dùng phải có quyền truy cập Milestone.
- Milestone phải thuộc Goal phù hợp.
- Không cho phép liên kết Action thuộc Goal A với Milestone thuộc Goal B nếu chưa có quy tắc cho phép.
- B04 quản lý Milestone.
- B05 quản lý Action và việc thiết lập association thông qua application contract.
- Không lưu bản sao Milestone bên trong Action.

**Relationship Validation:**

```text
Goal A
  |
  ├── Milestone A1
  |      |
  |      ├── Action 01
  |      └── Action 02
  |
  └── Milestone A2
         |
         └── Action 03
```

Một Action cũng có thể liên kết trực tiếp với Goal nếu relationship model được phê duyệt cho phép.

**OPEN — Relationship Cardinality:**

Master Blueprint chưa chốt cardinality chính xác.

Các câu hỏi cần giải quyết:

- Một Action bắt buộc phải liên kết trực tiếp với Goal hay có thể chỉ liên kết với Milestone?
- Một Action có thể liên kết với nhiều Milestones không?
- Một Action có thể liên kết với nhiều Goals không?
- Một Action có thể vừa liên kết trực tiếp với Goal vừa liên kết với Milestone không?
- Khi thay đổi Milestone, có cần cập nhật Goal association không?

Không tự triển khai database constraints cho các cardinality chưa được phê duyệt.

#### 8. Planning & Scheduling Integration

**Purpose:** Cho phép B07 sử dụng Action làm đối tượng lập kế hoạch và lên lịch.

**Ownership Boundaries:**

| Responsibility | Owner |
|---|---|
| Create Action | B05 |
| Update Action | B05 |
| Complete Action | B05 |
| Archive/Delete Action | B05 |
| Record actual execution | B05 |
| Create Daily Plan | B07 |
| Add/Remove Actions from Daily Plan | B07 |
| Create Schedule | B07 |
| Update Schedule | B07 |
| Delete Schedule | B07 |
| Retrieve scheduled Actions | B07 |

**Integration Rules:**

- B07 sử dụng Action ID để liên kết Schedule với Action.
- B07 không tạo bản sao Action.
- B07 không tự thay đổi Action status nếu không thông qua B05.
- B05 không tự tạo Schedule.
- B05 không trực tiếp cập nhật Daily Plan.
- Khi Action được complete, B07 có thể đọc trạng thái mới thông qua application contract.
- Khi Action được archive/delete, B07 phải xử lý các Schedule tham chiếu theo quy tắc đã được phê duyệt.
- Manual Planning và AI-approved Planning phải sử dụng cùng Action data và B07 workflow.

**OPEN:**

- Action đã archive có còn xuất hiện trong lịch sử Daily Plan không?
- Action đã completed có thể tiếp tục được Schedule không?
- Khi Action bị delete, Schedule được xóa, giữ lại hay đánh dấu không còn hợp lệ?

#### 9. Review Integration

**Purpose:** Cung cấp dữ liệu thực thi để B09 so sánh planned work với actual execution.

**B05 cung cấp:**

- Action ID.
- Action title.
- Action status.
- Actual start timestamp nếu có.
- Actual completion timestamp nếu có.
- Actual duration nếu có.
- Execution notes nếu có.

**B09 chịu trách nhiệm:**

- Retrieve planning data.
- Retrieve execution data.
- Compare planned and actual results.
- Retrieve progress history.
- Generate basic review summary.
- Record optional user review notes.

**Rules:**

- B05 chỉ cung cấp dữ liệu thực thi.
- B05 không tự so sánh planned và actual.
- B05 không tạo Review.
- B05 không tính toán hiệu suất hoặc progress.
- B09 không sửa trực tiếp Action data.
- Mọi thay đổi Action phải đi qua B05.

#### 10. Application Operations

B05 cung cấp các thao tác logic sau:

| Operation | Purpose |
|---|---|
| `createAction(input)` | Tạo Action |
| `getAction(actionId)` | Lấy chi tiết Action |
| `listActionsByGoal(goalId)` | Lấy Actions theo Goal |
| `listActionsByMilestone(milestoneId)` | Lấy Actions theo Milestone |
| `updateAction(actionId, input)` | Cập nhật Action |
| `updateActionStatus(actionId, status)` | Cập nhật Action status |
| `completeAction(actionId, input)` | Hoàn thành Action |
| `archiveAction(actionId)` | Archive Action |
| `deleteAction(actionId)` | Delete Action theo chính sách |
| `recordExecution(actionId, input)` | Ghi nhận dữ liệu thực thi |
| `getExecutionData(actionId)` | Truy xuất dữ liệu thực thi |
| `validateGoalAssociation(goalId, userId)` | Validate Goal association |
| `validateMilestoneAssociation(milestoneId, goalId, userId)` | Validate Milestone association |

Đây là các thao tác ở cấp kiến trúc, chưa phải HTTP endpoint cuối cùng.

Chi tiết implementation phụ thuộc vào backend framework, application contract và persistence layer được lựa chọn.

#### 11. Error Handling

B05 cần xử lý các lỗi cơ bản:

| Error Code | Meaning |
|---|---|
| `ACTION_NOT_FOUND` | Không tìm thấy Action |
| `ACTION_ACCESS_DENIED` | Không có quyền truy cập Action |
| `ACTION_INVALID_TITLE` | Title không hợp lệ |
| `ACTION_INVALID_INPUT` | Dữ liệu đầu vào không hợp lệ |
| `ACTION_INVALID_STATUS` | Status không hợp lệ |
| `ACTION_INVALID_STATUS_TRANSITION` | Chuyển trạng thái không hợp lệ |
| `ACTION_ALREADY_COMPLETED` | Action đã hoàn thành |
| `ACTION_COMPLETION_NOT_ALLOWED` | Không được phép hoàn thành Action |
| `ACTION_UPDATE_NOT_ALLOWED` | Không được phép cập nhật Action |
| `ACTION_ARCHIVE_NOT_ALLOWED` | Không được phép archive Action |
| `ACTION_DELETE_NOT_ALLOWED` | Không được phép delete Action |
| `ACTION_GOAL_NOT_FOUND` | Không tìm thấy Goal |
| `ACTION_GOAL_ACCESS_DENIED` | Không có quyền truy cập Goal |
| `ACTION_MILESTONE_NOT_FOUND` | Không tìm thấy Milestone |
| `ACTION_MILESTONE_ACCESS_DENIED` | Không có quyền truy cập Milestone |
| `ACTION_INVALID_ASSOCIATION` | Quan hệ Goal/Milestone không hợp lệ |
| `ACTION_INVALID_EXECUTION_DATA` | Dữ liệu thực thi không hợp lệ |
| `ACTION_INVALID_TIME_RANGE` | Khoảng thời gian thực thi không hợp lệ |
| `ACTION_PERSISTENCE_ERROR` | Lỗi lưu dữ liệu |
| `ACTION_UNKNOWN_ERROR` | Lỗi không xác định |

**Rules:**

- Không trả trực tiếp lỗi database hoặc lỗi nội bộ của module khác cho frontend.
- Sử dụng quy ước error response chung của D06.
- Không để lộ dữ liệu người dùng khác trong error response.
- Phân biệt lỗi validation, authorization, conflict và persistence.
- Không ghi thông tin nhạy cảm không cần thiết vào log.

#### 12. Dependencies

| Dependency | Purpose |
|---|---|
| B01 — Authentication & User Context | Resolve authenticated User Context |
| B03 — Goal Management | Validate Goal association |
| B04 — Milestone Management | Validate Milestone association |
| B07 — Planning & Scheduling | Use Action as planning and scheduling entity |
| B09 — Review Management | Consume execution data |
| C01 — Identity & Ownership Rules | Ownership validation |
| C03 — Goal & Hierarchy Rules | Goal relationship rules |
| C04 — Milestone Rules | Milestone relationship rules |
| C05 — Action Rules | Action business invariants |
| C07 — Planning & Schedule Rules | Planning relationship rules |
| C09 — Review Rules | Review data requirements |
| D01 — Database & Persistence | Store Action and execution data |
| D03 — Shared Types & Contracts | Shared types and identifiers |
| D04 — Validation | Validate inputs and business constraints |
| D06 — Error Handling | Normalize errors |
| D07 — Logging & Observability | Record operational errors |
| D08 — Security & Configuration | Protect user-owned data |

**Integration Rules:**

- B05 sử dụng User Context từ B01.
- B05 sử dụng B03 và B04 để validate associations.
- B05 cung cấp Action operations cho B07.
- B05 cung cấp execution data cho B09.
- B05 sử dụng D01 để persist dữ liệu.
- B05 sử dụng D03, D04 và D06 theo shared contracts.
- B05 không phụ thuộc trực tiếp vào UI.
- B05 không gọi trực tiếp AI Provider.

#### 13. Security Requirements

MVP yêu cầu các biện pháp bảo vệ cơ bản:

- Người dùng phải được xác thực trước khi truy cập Action cá nhân.
- Mọi thao tác phải kiểm tra quyền truy cập Action.
- Goal/Milestone association phải được xác thực.
- Không tin tưởng `user_id` do frontend tự gửi.
- Không cho phép truy cập Action thuộc dữ liệu người dùng khác.
- Không cho phép liên kết Goal/Milestone thuộc người dùng khác.
- Backend phải thực hiện ownership validation.
- Database phải duy trì foreign key và constraints phù hợp.
- Không cho phép frontend tự quyết định Action status hợp lệ.
- Không để lộ execution data của người dùng khác.
- Không ghi thông tin nhạy cảm không cần thiết vào log.

Không xây dựng hệ thống permission phức tạp ngoài nhu cầu MVP.

#### 14. Acceptance Criteria

B05 được xem là đạt yêu cầu MVP khi:

**Action Creation**

- Người dùng tạo được Action với association hợp lệ.
- Không tạo được Action với Goal không tồn tại.
- Không tạo được Action với Milestone không hợp lệ.
- Không tạo được Action thuộc dữ liệu người dùng khác.
- Title không hợp lệ bị từ chối.
- Action mới có trạng thái mặc định đúng theo Domain Rules.

**Action Retrieval**

- Người dùng truy xuất được chi tiết Action.
- Người dùng lấy được Actions theo Goal.
- Người dùng lấy được Actions theo Milestone.
- Goal hoặc Milestone không có Action trả về danh sách rỗng.
- Không truy xuất được Action thuộc người dùng khác.

**Action Update**

- Người dùng cập nhật được các trường được phép.
- Không thay đổi được Action ID.
- Association changes được validate.
- Dữ liệu không hợp lệ bị từ chối.

**Action Status and Completion**

- Người dùng cập nhật được Action status theo transition rules.
- Người dùng hoàn thành được Action.
- `completed_at` được ghi nhận chính xác.
- Không tự động complete Goal hoặc Milestone.
- Thao tác lặp lại được xử lý an toàn.

**Archive/Delete**

- Archive và Delete tuân theo chính sách được phê duyệt.
- Không làm mất dữ liệu cần thiết cho Review ngoài chính sách đã phê duyệt.
- Các Schedule tham chiếu được xử lý đúng.
- Action archived không xuất hiện trong danh sách active mặc định.

**Execution Data**

- Người dùng ghi nhận được execution data.
- Dữ liệu thời gian không hợp lệ bị từ chối.
- Không nhầm planned time với actual execution time.
- Dữ liệu thực thi có thể được truy xuất cho Review.
- Execution data được lưu nhất quán với Action status.

**Integration**

- B07 sử dụng Action ID làm đối tượng Schedule.
- B09 truy xuất được execution data.
- B05 không quản lý Daily Plan hoặc Schedule.
- B05 không tính Goal Progress.

#### 15. Testing Requirements

**Unit Tests**

- Action input validation.
- Action title validation.
- Goal association validation.
- Milestone association validation.
- Action status transition.
- Action completion.
- Execution data validation.
- Time range validation.
- Archive/delete policy validation.

**Integration Tests**

- Create Action with valid Goal.
- Create Action with valid Milestone.
- Create Action with invalid Goal.
- Create Action with invalid Milestone.
- Retrieve Action.
- List Actions by Goal.
- List Actions by Milestone.
- Update Action.
- Complete Action.
- Record execution data.
- Retrieve execution data.
- Archive Action.
- Integrate with B03 and B04.
- Integrate with B07.
- Integrate with B09.

**Security Tests**

- Unauthenticated Action access.
- Invalid User Context.
- User A attempts to retrieve User B's Action.
- User A attempts to update User B's Action.
- User A attempts to complete User B's Action.
- User A attempts to associate Action with User B's Goal.
- User A attempts to associate Action with User B's Milestone.
- Unauthorized execution data access.

**End-to-End Tests**

1. Login → Open Goal → Create Action → Retrieve Action.
2. Login → Open Goal → Create Milestone → Create associated Action.
3. Login → Create Action → Update Action → Complete Action.
4. Login → Create Action → Record execution data → Retrieve execution data.
5. Login → Create Action → Schedule Action through B07 → Complete Action through B05.
6. Login → Complete Action → Review actual execution through B09.
7. User A → Attempt to access User B's Action → Rejected.

#### 16. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Confirm Action Domain Model | C05 |
| 2 | Confirm Goal/Milestone relationship cardinality | B03, B04, C03, C04 |
| 3 | Define Action schema and constraints | D01 |
| 4 | Define execution data model | C05, C09, D01 |
| 5 | Define shared Action types | D03 |
| 6 | Implement Action input validation | D04 |
| 7 | Implement Goal/Milestone association validation | B03, B04 |
| 8 | Implement Create Action | D01, B03, B04 |
| 9 | Implement Get/List Actions | D01 |
| 10 | Implement Update Action | D01 |
| 11 | Implement Action status management | C05 |
| 12 | Implement Complete Action | C05, D01 |
| 13 | Implement execution data operations | C05, D01 |
| 14 | Implement archive/delete under approved rules | C05 |
| 15 | Integrate with B07 | B07 |
| 16 | Integrate with B09 | B09 |
| 17 | Run integration and security tests | Required dependencies |

Triển khai theo từng bước nhỏ. Không xây dựng thêm workflow hoặc abstraction không phục vụ trực tiếp MVP.

#### 17. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Recurring Actions.
- Action Dependencies.
- Nested Actions.
- Advanced Execution Sessions.
- Pomodoro and Built-in Timer.
- Automatic Action Scheduling.
- Automatic Action Rescheduling.
- Team Assignment.
- Collaborative Action Management.
- Advanced Action Analytics.
- AI-generated Action Optimization.
- Autonomous Action Completion.
- Advanced Notifications and Reminders.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

#### 18. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Action Purpose | APPROVED BY BLUEPRINT | Concrete unit of work |
| Action Execution Level | APPROVED BY BLUEPRINT | Not further decomposed into Goal nodes in MVP |
| Action–Goal/Milestone Association | APPROVED BY BLUEPRINT | Must be associated with a relevant Goal or Milestone |
| Association Cardinality | OPEN | Exact rules require Domain decision |
| Action Core Operations | APPROVED BY BLUEPRINT | Create, retrieve, update, complete, archive/delete |
| Action Status Values | PROPOSED | TODO / IN_PROGRESS / COMPLETED |
| Reopen Behavior | OPEN | Requires Domain decision |
| Archive/Delete Policy | OPEN | Requires lifecycle decision |
| Execution Data Model | PROPOSED | Basic actual execution information |
| Multiple Execution Sessions | OPEN | Requires Domain decision |
| Schedule Ownership | B07 OWNERSHIP | B05 does not manage Schedule |
| Daily Plan Ownership | B07 OWNERSHIP | B05 does not manage Daily Plan |
| Review Ownership | B09 OWNERSHIP | B05 provides execution data |
| Progress Calculation | B08 OWNERSHIP | B05 does not calculate progress |
| Database Technology | OPEN — D01 | Defined in D01 |
| API Contract | OPEN — D05 | Defined in D05 |

#### 19. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED

**Development Status:** PARTIALLY AVAILABLE

**Implementation Status:** NOT_STARTED

**Core Functions Available for Implementation:**

- Create Action.
- Get Action.
- List Actions by Goal.
- List Actions by Milestone, subject to relationship contract.
- Update Action.
- Update Action status.
- Complete Action.
- Basic execution data recording.

Các chức năng trên có thể triển khai sau khi B03, B04 và persistence/shared contracts cần thiết được cung cấp.

**Remaining Dependencies:**

- B03: Goal retrieval and ownership validation contract.
- B04: Milestone retrieval and ownership validation contract.
- B07: Action–Schedule integration contract.
- B09: Execution data consumption requirements.
- C05: Final Action business rules.
- C07: Planning and Schedule rules.
- C09: Review data requirements.
- D01: Action and execution persistence schema.
- D03: Shared types and identifiers.
- D04: Validation contract.
- D06: Error response contract.
- D08: Security and configuration.

**Implementation Restrictions:**

- Không tự triển khai Goal Management bên trong B05.
- Không tự triển khai Milestone Management bên trong B05.
- Không tự quyết định relationship cardinality chưa được phê duyệt.
- Không tự thêm status chưa được phê duyệt vào Domain Model.
- Không triển khai Schedule hoặc Daily Plan bên trong B05.
- Không triển khai Review bên trong B05.
- Không triển khai Goal Progress Calculation bên trong B05.
- Không tự xóa Schedule hoặc Review data khi archive/delete Action.
- Không invent file paths trước khi repository structure và technology stack được phê duyệt.

**Final Implementation Rule:**

Build only the Action Management functionality required by FLOW-UP MVP. Keep Action as the execution-level unit of work, preserve clear ownership boundaries between B03, B04, B05, B07, B08, and B09, and avoid introducing unapproved business rules or unnecessary abstractions.

# B06. Measurement Management

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED  
**Development Status:** PARTIALLY AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

---

#### 1. Purpose

B06 chịu trách nhiệm quản lý Measurement — các chỉ số dùng để đánh giá một khía cạnh kết quả của Goal trong FLOW-UP.

Mục tiêu là cho phép người dùng:

- Định nghĩa những chỉ số cần theo dõi cho một Goal.
- Thiết lập đơn vị và giá trị mục tiêu khi cần thiết.
- Ghi nhận giá trị Measurement theo thời gian.
- Truy xuất giá trị hiện tại và lịch sử thay đổi.
- Đảm bảo dữ liệu Measurement hợp lệ trước khi lưu trữ.

Ví dụ:

Một Goal có nội dung "Đạt IELTS 7.0" có thể theo dõi các Measurement:

- Overall: 7.0
- Listening: 7.5
- Reading: 7.0
- Writing: 6.5
- Speaking: 6.5

B06 chỉ chịu trách nhiệm quản lý định nghĩa và dữ liệu Measurement.

B06 không chịu trách nhiệm tính toán tiến độ Goal. Việc tính toán Measurement Progress thuộc B08 — Progress Engine.

---

#### 2. MVP Scope

**Included:**

- Create Measurement Definition.
- Retrieve Measurement Definition.
- Update Measurement Definition.
- Archive Measurement Definition under approved rules.
- Record Measurement Value.
- Retrieve Current Measurement Value.
- Retrieve Measurement History.
- Validate Measurement Value Type.
- Validate Measurement Unit.
- Validate Target Value.
- Validate Measurement Ownership and Goal Relationship.
- Basic Measurement Error Handling.

**Excluded:**

- Advanced Statistical Analysis.
- Automatic Data Collection from External Services.
- Third-party Health or Fitness Integrations.
- Complex Measurement Formula Builder.
- Multi-dimensional Data Visualization.
- Predictive Measurement Analysis.
- Automatic Goal Progress Calculation.
- Advanced Measurement Versioning.
- Complex Measurement Templates.
- AI-generated Measurement Changes without User Approval.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm có nhu cầu thực tế.

---

#### 3. Measurement Model

Measurement mô tả cách một khía cạnh kết quả của Goal được đánh giá.

Measurement gồm hai thành phần riêng biệt:

**A. Measurement Definition**

Định nghĩa một chỉ số cần theo dõi.

Ví dụ:

| Field | Example |
|---|---|
| Label | IELTS Overall |
| Unit | Band Score |
| Target Value | 7.0 |
| Value Type | Numeric |

**B. Measurement Record**

Lưu một giá trị được ghi nhận tại một thời điểm.

Ví dụ:

| Recorded At | Value |
|---|---:|
| 2026-11-01 | 5.5 |
| 2026-11-08 | 6.0 |
| 2026-11-15 | 6.5 |

**Logical Data Model — Proposed**

Measurement Definition:

| Field | Description |
|---|---|
| id | Unique Measurement ID |
| goal_id | Owning Goal ID |
| label | Measurement name |
| description | Optional description |
| value_type | Data type of the value |
| unit | Measurement unit |
| target_value | Optional target value |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |
| archived_at | Optional archive timestamp |

Measurement Record:

| Field | Description |
|---|---|
| id | Unique Record ID |
| measurement_id | Related Measurement ID |
| value | Recorded value |
| recorded_at | Time the value represents |
| created_at | Record creation timestamp |
| note | Optional user note |

Các field trên là logical proposal, chưa phải Database Schema đã được phê duyệt.

**Important Rules:**

- Measurement Definition và Measurement Record phải được phân biệt.
- Một Measurement Definition có thể có nhiều Measurement Records.
- Measurement Record phải tham chiếu đến một Measurement Definition hợp lệ.
- Measurement Definition thuộc về một Goal.
- Measurement không thay thế Goal, Milestone hoặc Action.
- Không lưu tiến độ tính toán của Goal trực tiếp trong Measurement Record.

Cardinality và các thuộc tính chính thức sẽ được xác định trong C06 — Measurement Rules và D01 — Database & Persistence.

---

#### 4. Measurement Value Type and Unit

B06 phải xác định và kiểm tra kiểu dữ liệu của Measurement Value trước khi lưu.

**Proposed Value Types:**

| Type | Example | Description |
|---|---|---|
| NUMBER | 7.5 | Numeric value, including decimals |
| INTEGER | 120 | Whole number |
| BOOLEAN | true | Binary value |
| TEXT | Completed | Text value |

Danh sách trên là đề xuất để thảo luận, chưa phải danh sách Value Type được phê duyệt.

**Unit Examples:**

| Measurement | Unit |
|---|---|
| IELTS Overall | Band Score |
| Body Weight | kg |
| Reading Time | Minutes |
| Completed Tasks | Tasks |
| Running Distance | km |

**Rules:**

- Value phải phù hợp với Value Type của Measurement Definition.
- Unit phải được xác định rõ nếu Measurement cần đơn vị.
- Measurement Value không được tự ý sử dụng một Unit khác với Definition.
- Target Value phải tương thích với Value Type và Unit.
- Không thực hiện implicit conversion giữa các đơn vị.
- Không chấp nhận dữ liệu sai kiểu hoặc không hợp lệ.

**OPEN Decisions:**

- Có hỗ trợ TEXT và BOOLEAN trong MVP không?
- Có cho phép Measurement không có Unit không?
- Có hỗ trợ chuyển đổi Unit không?
- Có hỗ trợ các kiểu dữ liệu phức tạp hoặc nhiều giá trị trong một Record không?

---

#### 5. Core Functions

##### B06.1. Create Measurement Definition

**Purpose:** Tạo một Measurement Definition mới cho Goal.

**Input:**

- Goal ID.
- Label.
- Description (optional).
- Value Type.
- Unit (optional, subject to approved rules).
- Target Value (optional).

**Processing:**

1. Resolve Current User Context.
2. Validate Goal ID.
3. Validate Goal ownership and accessibility.
4. Validate required fields.
5. Validate Value Type.
6. Validate Unit.
7. Validate Target Value if provided.
8. Create Measurement Definition.
9. Persist the Definition.
10. Return created Measurement.

**Output:**

- Measurement Definition.

**Rules:**

- Measurement phải thuộc một Goal hợp lệ.
- Không được tạo Measurement cho Goal mà người dùng không có quyền truy cập.
- Không được tạo Measurement với Label không hợp lệ.
- Target Value phải phù hợp với Value Type.
- B06 không tạo hoặc thay đổi Goal.

##### B06.2. Get Measurement Definition

**Purpose:** Truy xuất thông tin một Measurement.

**Input:**

- Measurement ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement.
3. Validate ownership through its owning Goal.
4. Return Measurement Definition.

**Output:**

- Measurement Definition.

**Rules:**

- Không trả về Measurement thuộc dữ liệu của User khác.
- Measurement không tồn tại phải trả về lỗi tương ứng.
- Archived Measurement được xử lý theo approved archive policy.

##### B06.3. List Measurements by Goal

**Purpose:** Truy xuất danh sách Measurement của một Goal.

**Input:**

- Goal ID.

**Processing:**

1. Resolve Current User Context.
2. Validate Goal ownership.
3. Retrieve Measurement Definitions associated with Goal.
4. Apply archive visibility rules.
5. Return Measurement list.

**Output:**

- List of Measurement Definitions.

**Rules:**

- Chỉ trả về Measurement thuộc Goal được yêu cầu.
- Không truy xuất Measurement từ Goal khác.
- Không tự tính Measurement Progress.

##### B06.4. Update Measurement Definition

**Purpose:** Cập nhật thông tin Measurement Definition.

**Input:**

- Measurement ID.
- Label (optional).
- Description (optional).
- Unit (optional).
- Target Value (optional).

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement.
3. Validate ownership.
4. Validate updated fields.
5. Validate Value Type compatibility.
6. Validate Unit and Target Value.
7. Persist changes.
8. Return updated Measurement.

**Rules:**

- Không cho phép thay đổi Measurement thuộc User khác.
- Target Value phải tương thích với Value Type.
- Thay đổi Definition không được âm thầm làm sai lệch ý nghĩa của các Record cũ.
- Quy tắc thay đổi Unit sau khi đã có Record phải được xác định trước khi triển khai.

##### B06.5. Record Measurement Value

**Purpose:** Ghi nhận một giá trị mới cho Measurement.

**Input:**

- Measurement ID.
- Value.
- Recorded At (optional, subject to approved rules).
- Note (optional).

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement Definition.
3. Validate ownership.
4. Validate Measurement availability.
5. Validate Value Type.
6. Validate Unit compatibility.
7. Validate recorded timestamp.
8. Create Measurement Record.
9. Persist Record.
10. Return created Record.

**Output:**

- Measurement Record.

**Rules:**

- Record phải tham chiếu đến một Measurement Definition hợp lệ.
- Value phải đúng Value Type.
- Không được ghi Record vào Measurement thuộc User khác.
- Không được ghi Record vào Measurement đã bị archived nếu policy không cho phép.
- Mỗi lần ghi nhận giá trị mới phải tạo một Record riêng nếu History Model được phê duyệt theo hướng append-only.
- Không ghi đè Record cũ chỉ vì người dùng nhập giá trị mới.

##### B06.6. Get Current Measurement Value

**Purpose:** Truy xuất giá trị hiện tại của Measurement.

**Input:**

- Measurement ID.

**Processing:**

1. Resolve Current User Context.
2. Validate Measurement ownership.
3. Retrieve Measurement Records.
4. Resolve current value according to approved ordering rules.
5. Return current value.

**Output:**

- Current Measurement Value.
- Recorded At.
- Related Measurement ID.

**Rules:**

- Không tự tính giá trị hiện tại từ nhiều Record nếu chưa có rule.
- Cách xác định Record hiện tại phải dựa trên History Model đã phê duyệt.
- Nếu Measurement chưa có Record, trả về trạng thái chưa có dữ liệu thay vì tự tạo giá trị mặc định.

##### B06.7. Get Measurement History

**Purpose:** Truy xuất lịch sử các giá trị Measurement.

**Input:**

- Measurement ID.
- Optional date range.
- Optional pagination parameters.

**Processing:**

1. Resolve Current User Context.
2. Validate Measurement ownership.
3. Retrieve related Measurement Records.
4. Apply date range if provided.
5. Apply pagination if supported.
6. Return records in the approved ordering.

**Output:**

- List of Measurement Records.

**Rules:**

- Chỉ trả về Record thuộc Measurement được yêu cầu.
- Không được làm mất lịch sử khi thêm Record mới.
- Thứ tự hiển thị phải nhất quán.
- Không tự sửa hoặc xóa lịch sử trong quá trình truy xuất.

##### B06.8. Archive Measurement Definition

**Purpose:** Ngừng theo dõi một Measurement mà không nhất thiết xóa lịch sử đã ghi nhận.

**Input:**

- Measurement ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement.
3. Validate ownership.
4. Validate current archive state.
5. Apply approved archive policy.
6. Persist archive state.

**Rules:**

- Archive không đồng nghĩa với xóa toàn bộ Measurement Records.
- Không tự động xóa lịch sử.
- Việc có cho phép khôi phục Measurement hay không vẫn là OPEN.
- Ảnh hưởng của archived Measurement đến B08 và B09 phải tuân theo quy tắc đã được phê duyệt.

---

#### 6. Measurement–Goal Relationship

Measurement dùng để đánh giá một khía cạnh kết quả của Goal.

**Approved Concept:**

- Goal có thể có Measurement Definitions và Records.
- Measurement Definition thuộc về một Goal.
- Measurement không phải là Goal độc lập.
- B03 sở hữu Goal.
- B06 sở hữu Measurement.

**Example:**

```text
Goal: Achieve IELTS 7.0
│
├── Measurement: Overall
│   ├── Record: 5.5
│   ├── Record: 6.0
│   └── Record: 6.5
│
├── Measurement: Listening
│   ├── Record: 6.0
│   └── Record: 7.0
│
└── Measurement: Writing
    ├── Record: 5.5
    └── Record: 6.0
```

**Rules:**

- Mỗi Measurement phải có một owning Goal hợp lệ.
- B06 phải xác thực Goal ownership trước khi tạo hoặc thay đổi Measurement.
- B06 không được tự thay đổi Goal.
- B06 không được tự quyết định trạng thái hoàn thành của Goal.
- Việc Goal bị archive, delete hoặc move phải tuân theo quy tắc của B03 và C03.

**OPEN Decisions:**

- Một Goal được phép có tối đa bao nhiêu Measurement?
- Có cho phép hai Measurement có cùng Label trong một Goal không?
- Measurement có được chuyển sang Goal khác không?
- Khi Goal bị archive hoặc delete, Measurement và Records được xử lý như thế nào?

---

#### 7. Measurement and Progress Integration

B06 cung cấp dữ liệu đầu vào cho B08 — Progress Engine.

**B06 Responsibilities:**

- Quản lý Measurement Definition.
- Ghi nhận Measurement Record.
- Truy xuất Current Value.
- Truy xuất Measurement History.
- Đảm bảo dữ liệu hợp lệ.

**B08 Responsibilities:**

- Calculate Measurement Progress where applicable.
- Compare actual values with targets.
- Calculate Goal Progress.
- Provide progress summaries.

**Rules:**

- B06 không tính phần trăm hoàn thành của Measurement.
- B06 không tự tính Goal Progress.
- B06 không tự quyết định cách tính tiến độ khi Measurement tăng hoặc giảm.
- B08 chỉ sử dụng dữ liệu Measurement hợp lệ.
- Calculation Rules phải được phê duyệt trong C08 trước khi triển khai.

**Example:**

```text
Measurement Definition
        │
        ▼
Measurement Records
        │
        ▼
B06 validates and provides data
        │
        ▼
B08 calculates Measurement Progress
        │
        ▼
Goal Progress
```

Không được triển khai công thức Progress trực tiếp trong B06 hoặc UI.

---

#### 8. Application Operations

B06 cung cấp các application operations phục vụ Measurement workflows.

**Required Operations:**

| Operation | Responsibility |
|---|---|
| CreateMeasurement | Create Measurement Definition |
| GetMeasurement | Retrieve Measurement Definition |
| ListMeasurementsByGoal | Retrieve Goal Measurements |
| UpdateMeasurement | Update Measurement Definition |
| RecordMeasurementValue | Create Measurement Record |
| GetCurrentMeasurementValue | Retrieve current value |
| GetMeasurementHistory | Retrieve historical records |
| ArchiveMeasurement | Archive Measurement |

**Rules:**

- Mọi operation phải sử dụng Current User Context từ B01.
- Mọi operation phải xác thực ownership.
- Validation phải được thực hiện ở Backend/Domain.
- Không tin tưởng dữ liệu validation từ Frontend.
- Persistence phải thông qua D01.
- Không để Frontend trực tiếp ghi Measurement vào Database.
- Các operation phục vụ cùng một nghiệp vụ phải sử dụng chung Domain Rules.

Tên operation là logical names, chưa phải API route hoặc function signature chính thức.

---

#### 9. Error Handling

B06 cần xử lý các lỗi liên quan đến Measurement.

| Error Code | Description |
|---|---|
| MEASUREMENT_NOT_FOUND | Measurement không tồn tại |
| MEASUREMENT_ACCESS_DENIED | Không có quyền truy cập Measurement |
| MEASUREMENT_GOAL_NOT_FOUND | Goal không tồn tại |
| MEASUREMENT_INVALID_LABEL | Label không hợp lệ |
| MEASUREMENT_INVALID_VALUE_TYPE | Value Type không hợp lệ |
| MEASUREMENT_INVALID_VALUE | Value không đúng kiểu dữ liệu |
| MEASUREMENT_INVALID_UNIT | Unit không hợp lệ |
| MEASUREMENT_INVALID_TARGET | Target Value không hợp lệ |
| MEASUREMENT_INVALID_TIMESTAMP | Recorded At không hợp lệ |
| MEASUREMENT_RECORD_NOT_FOUND | Measurement Record không tồn tại |
| MEASUREMENT_ARCHIVED | Measurement đã bị archived |
| MEASUREMENT_INVALID_UPDATE | Không thể thực hiện cập nhật theo rules |
| MEASUREMENT_PERSISTENCE_ERROR | Lỗi lưu trữ dữ liệu |

**Rules:**

- Error phải có ý nghĩa rõ ràng.
- Không trả về thông tin nhạy cảm.
- Không tiết lộ Measurement hoặc Goal thuộc User khác.
- Không trả về lỗi Database nội bộ trực tiếp cho Client.
- Các lỗi phải sử dụng shared error handling từ D06.

---

#### 10. Dependencies

**Internal Dependencies:**

| Module | Dependency |
|---|---|
| B01 — Authentication & User Context | Current User Context |
| B03 — Goal Management | Goal ownership and validation |
| B08 — Progress Engine | Measurement data for progress calculation |
| B09 — Review Management | Measurement history and recorded results |
| B10 — AI Orchestration | User-approved Measurement proposals, if supported |

**Domain Dependencies:**

- C01 — Identity & Ownership Rules.
- C03 — Goal & Hierarchy Rules.
- C06 — Measurement Rules.
- C08 — Progress Rules.
- C09 — Review Rules.

**Infrastructure Dependencies:**

- D01 — Database & Persistence.
- D03 — Shared Types & Contracts.
- D04 — Validation.
- D05 — API / Application Communication.
- D06 — Error Handling.
- D07 — Logging & Observability.
- D08 — Security & Configuration.

**Frontend Dependencies:**

- A06 — Measurement Interface.
- A09 — Progress & Review Interface.

---

#### 11. Security Requirements

B06 phải tuân thủ các yêu cầu bảo vệ dữ liệu cá nhân.

**Authentication:**

- Mọi Measurement operation yêu cầu authenticated user.
- Không cho phép truy cập Measurement khi không có Current User Context hợp lệ.

**Authorization:**

- Measurement phải được truy cập thông qua owning Goal.
- Backend phải xác thực quyền sở hữu Goal trước khi đọc hoặc ghi Measurement.
- Không tin tưởng User ID hoặc Goal ID do Frontend tự gửi mà chưa xác thực.

**Data Integrity:**

- Không cho phép Measurement Record tham chiếu đến Measurement không tồn tại.
- Không cho phép ghi dữ liệu sai kiểu.
- Không cho phép thay đổi dữ liệu lịch sử trái với approved rules.
- Không để Measurement của User này liên kết với Goal của User khác.

**Privacy:**

- Không trả về dữ liệu Measurement của User khác.
- Không ghi dữ liệu cá nhân nhạy cảm vào application logs nếu không cần thiết.
- Không expose Database errors hoặc internal implementation details.

---

#### 12. Acceptance Criteria

B06 được xem là đáp ứng yêu cầu MVP khi:

- [ ] User có thể tạo Measurement Definition cho Goal hợp lệ.
- [ ] User có thể truy xuất Measurement Definition.
- [ ] User có thể xem danh sách Measurements của Goal.
- [ ] User có thể cập nhật Measurement Definition.
- [ ] User có thể ghi nhận Measurement Value.
- [ ] Hệ thống kiểm tra Value Type trước khi lưu.
- [ ] Hệ thống kiểm tra Unit theo approved rules.
- [ ] Hệ thống kiểm tra Target Value theo approved rules.
- [ ] User có thể truy xuất Current Measurement Value.
- [ ] User có thể truy xuất Measurement History.
- [ ] Measurement Record được liên kết đúng với Measurement Definition.
- [ ] Measurement không thể truy cập chéo giữa các User.
- [ ] Archive không tự động xóa lịch sử nếu chưa có approved deletion policy.
- [ ] B06 không tự tính Goal Progress.
- [ ] B08 có thể truy xuất dữ liệu Measurement cần thiết để tính tiến độ.
- [ ] Các lỗi được trả về theo shared error handling.

---

#### 13. Testing Requirements

**Unit Tests**

- Measurement Definition input validation.
- Measurement Label validation.
- Value Type validation.
- Unit validation.
- Target Value validation.
- Measurement Record validation.
- Measurement–Goal relationship validation.
- Current Value resolution.
- Measurement History ordering.
- Archive state handling.

**Integration Tests**

- Create Measurement Definition.
- Retrieve Measurement Definition.
- List Measurements by Goal.
- Update Measurement Definition.
- Record Measurement Value.
- Retrieve Current Measurement Value.
- Retrieve Measurement History.
- Archive Measurement.
- Measurement persistence.
- Integration with Goal ownership validation.

**Security Tests**

- Unauthenticated Measurement request.
- Access Measurement belonging to another User.
- Record value for another User's Measurement.
- Create Measurement under another User's Goal.
- Forge Goal ID from Frontend.
- Access archived Measurement under restricted operations.

**Data Integrity Tests**

- Invalid Value Type.
- Invalid Unit.
- Invalid Target Value.
- Invalid timestamp.
- Missing Measurement Definition.
- Measurement Record with invalid reference.
- Definition update that conflicts with existing Records.

**End-to-End Tests**

1. Create Goal → Create Measurement → Record Value → Retrieve Current Value.
2. Create Goal → Create Measurement → Record multiple values → Retrieve History.
3. Create Measurement → Update Target → Verify updated Definition.
4. Create Measurement → Archive Measurement → Verify archive behavior and history preservation.
5. User A → Attempt to access User B's Measurement → Rejected.

---

#### 14. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Finalize Measurement Domain Rules | C06 |
| 2 | Define Measurement and Measurement Record models | C06, D03 |
| 3 | Prepare Measurement persistence schema | D01 |
| 4 | Implement Measurement validation | D04 |
| 5 | Implement Measurement ownership checks | B01, B03, C01 |
| 6 | Implement Create Measurement | D01, D03, D04 |
| 7 | Implement Retrieve and List Measurements | D01, B03 |
| 8 | Implement Update Measurement | D01, D04 |
| 9 | Implement Record Measurement Value | D01, D04 |
| 10 | Implement Current Value and History retrieval | D01 |
| 11 | Implement Archive Measurement | Approved archive rules |
| 12 | Integrate with B08 | C08, B08 |
| 13 | Integrate with B09 | B09 |
| 14 | Run integration and security tests | Required dependencies |

Triển khai theo từng bước nhỏ.

Không xây dựng Measurement Formula Engine hoặc các cơ chế thống kê phức tạp trong MVP.

---

#### 15. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Measurement Templates.
- External Data Integrations.
- Automatic Measurement Collection.
- Advanced Measurement Formulas.
- Statistical Analysis.
- Measurement Forecasting.
- Advanced Measurement Visualization.
- Measurement Versioning.
- Measurement Comparison.
- AI-assisted Measurement Definition.
- Advanced Unit Conversion.
- Multi-dimensional Measurement Data.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

---

#### 16. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Measurement Purpose | APPROVED BY BLUEPRINT | Evaluate an aspect of Goal result |
| Measurement Definition | APPROVED BY BLUEPRINT | Separate from recorded values |
| Measurement Records | APPROVED BY BLUEPRINT | Separate recorded data |
| Measurement–Goal Relationship | APPROVED CONCEPT | Measurement belongs to a Goal |
| Measurement Cardinality | OPEN — C06 | To be defined in Domain Model |
| Supported Value Types | OPEN — C06 | To be finalized |
| Unit Rules | OPEN — C06 | To be finalized |
| Target Value | APPROVED CONCEPT | Optional target where applicable |
| Target Validation | OPEN — C06 | To be finalized |
| Current Value Resolution | OPEN — C06 | To be defined |
| History Model | OPEN — C06 | To be defined |
| Measurement Update Rules | OPEN — C06 | Especially Unit and Value Type changes |
| Measurement Archive Policy | OPEN — C06 | To be defined |
| Goal Archive/Delete Effects | OPEN — C03/C06 | To be coordinated with B03 |
| Measurement Progress Calculation | B08 RESPONSIBILITY | Not implemented in B06 |
| Progress Calculation Rules | OPEN — C08 | Must be explicitly approved |
| Database Technology | OPEN — D01 | Defined in D01 |

**Outstanding Product Owner Decisions:**

| ID | Decision | Question |
|---|---|---|
| MEASUREMENT-001 | Supported Value Types | MVP supports NUMBER only, or also INTEGER, BOOLEAN and TEXT? |
| MEASUREMENT-002 | Measurement Cardinality | Can a Goal contain unlimited Measurements? |
| MEASUREMENT-003 | Duplicate Labels | Can a Goal have multiple Measurements with the same Label? |
| MEASUREMENT-004 | Unit Rules | Is Unit required, optional, or dependent on Value Type? |
| MEASUREMENT-005 | Target Rules | Can a Measurement have no Target Value? |
| MEASUREMENT-006 | History Model | Are Records append-only, or can users edit/delete historical Records? |
| MEASUREMENT-007 | Current Value | Is the current value the latest Record by recorded_at or by created_at? |
| MEASUREMENT-008 | Definition Changes | Can Value Type or Unit change after Records exist? |
| MEASUREMENT-009 | Archive Behavior | Can an archived Measurement be restored or receive new Records? |
| MEASUREMENT-010 | Goal Lifecycle | What happens to Measurements and Records when their Goal is archived or deleted? |

Các quyết định trên phải được Product Owner phê duyệt trước khi triển khai những chức năng liên quan.

---

#### 17. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED

**Development Status:** PARTIALLY AVAILABLE.

**Implementation Status:** NOT_STARTED.

**Available Core Work:**

- Define Measurement Definition and Measurement Record contracts.
- Implement basic Measurement ownership validation.
- Implement create and retrieve operations.
- Implement basic Measurement persistence.
- Implement Measurement Record creation.
- Implement basic history retrieval, subject to the approved ordering model.

**Remaining Dependencies:**

- C06: Finalize Measurement Domain Rules.
- C08: Approve Measurement Progress calculation rules.
- D01: Provide Measurement and Measurement Record persistence.
- D03: Provide shared Measurement types.
- D04: Provide validation mechanisms.
- D06: Provide shared error handling.
- B01: Provide Current User Context.
- B03: Provide Goal ownership and validation operations.
- B08: Integrate Measurement data into Progress Engine.
- B09: Integrate Measurement history into Review.

**Final Implementation Rule:**

B06 manages Measurement Definitions and Measurement Records only.

Do not implement Goal Progress calculations inside B06. Do not silently modify historical Measurement data. Do not introduce unsupported value types, Unit conversions, formulas, or advanced Measurement features before their Domain Rules are approved.

The implementation should prioritize reliable data recording, validation, retrieval, and history preservation for the FLOW-UP MVP.

# B07. Planning & Scheduling

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED  
**Development Status:** PARTIALLY AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

---

#### 1. Purpose

B07 chịu trách nhiệm quản lý Planning và Scheduling trong FLOW-UP.

Mục tiêu là cho phép người dùng lập kế hoạch công việc theo ngày, sắp xếp Actions vào các khoảng thời gian dự kiến và quản lý lịch trình thông qua Planning Interface hoặc Calendar Interface.

B07 cung cấp các application operations dùng chung cho:

- Manual Planning.
- AI-approved Planning.
- Calendar interactions.

Các workflow trên phải sử dụng cùng một Planning và Schedule model, không tạo các hệ thống lưu trữ hoặc xử lý lịch trình riêng biệt.

B07 chỉ quản lý kế hoạch và thời gian dự kiến. Việc quản lý Action thuộc B05, còn dữ liệu thực thi thực tế thuộc B05.

---

#### 2. MVP Scope

**Included:**

- Create Daily Plan.
- Retrieve Daily Plan.
- Update Daily Plan.
- Add Actions to Daily Plan.
- Remove Actions from Daily Plan.
- Create Schedule Entries.
- Retrieve Schedule Entries.
- Update Schedule Entries.
- Delete Schedule Entries.
- Retrieve Schedules by Date Range.
- Validate Date and Time Information.
- Validate Action and Schedule Relationships.
- Shared Planning Operations.
- Manual Planning Workflow.
- AI-approved Planning Workflow.
- Calendar-based Schedule Management.
- Basic Schedule Conflict Validation, subject to approved rules.
- Basic Planning Error Handling.

**Excluded:**

- Advanced Calendar Synchronization.
- External Calendar Provider Integration.
- Complex Recurring Schedules.
- Automatic Schedule Optimization.
- Automatic Action Reordering.
- Advanced Resource Allocation.
- Team Scheduling.
- Multi-user Calendar Sharing.
- Advanced Time Tracking.
- Automatic Action Execution.
- Autonomous AI Schedule Changes.
- Advanced Calendar Notifications.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm có nhu cầu thực tế.

---

#### 3. Planning and Schedule Model

B07 quản lý hai khái niệm chính: Daily Plan và Schedule.

**A. Daily Plan**

Daily Plan đại diện cho kế hoạch của người dùng trong một ngày cụ thể.

Một Daily Plan được tập hợp từ các Actions có lịch trình trong ngày đó.

Ví dụ:

```text
Daily Plan — 2026-11-18
│
├── 08:00 — Study Python
├── 10:00 — Complete Database Exercise
├── 14:00 — Work on FLOW-UP
└── 19:00 — Practice English
```

**B. Schedule**

Schedule đại diện cho thời gian dự kiến dành cho một Action.

Schedule chứa thông tin thời gian để hệ thống biết Action được lên lịch khi nào và trong khoảng thời gian nào.

Ví dụ:

| Field | Example |
|---|---|
| Action | Study Python |
| Start Time | 08:00 |
| End Time | 09:30 |
| Duration | 90 minutes |
| Scheduled Date | 2026-11-18 |

**Logical Data Model — Proposed**

Daily Plan:

| Field | Description |
|---|---|
| id | Unique Daily Plan ID |
| user_id | Owner User ID |
| date | Planned date |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

Schedule:

| Field | Description |
|---|---|
| id | Unique Schedule ID |
| action_id | Related Action ID |
| daily_plan_id | Related Daily Plan ID, if required by approved model |
| start_at | Planned start datetime |
| end_at | Planned end datetime |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

Các field trên là logical proposal, chưa phải Database Schema đã được phê duyệt.

**Important Rules:**

- Schedule đại diện cho thời gian dự kiến, không phải thời gian thực thi.
- Schedule phải liên kết với một Action hợp lệ.
- Daily Plan đại diện cho kế hoạch trong một ngày.
- Daily Plan được tập hợp từ các Actions đã được lên lịch.
- Manual Planning và AI-assisted Planning phải sử dụng cùng Planning và Schedule model.
- Calendar chỉ là một giao diện tương tác với dữ liệu Schedule, không sở hữu một bản sao dữ liệu lịch trình riêng.

**OPEN Decisions:**

- Một Daily Plan có duy nhất một bản ghi cho mỗi User và mỗi ngày không?
- Một Action có thể có nhiều Schedule Entries không?
- Một Schedule Entry có thể thuộc nhiều Daily Plans không?
- Schedule có bắt buộc phải gắn với Daily Plan không?
- Có hỗ trợ Schedule kéo dài qua nhiều ngày không?

---

#### 4. Date and Time Rules

B07 chịu trách nhiệm xác thực thông tin ngày và giờ trước khi lưu Schedule.

**Validation Requirements:**

- Start Time phải là một datetime hợp lệ.
- End Time phải là một datetime hợp lệ.
- End Time phải sau Start Time.
- Scheduled Date phải hợp lệ.
- Các thông tin thời gian phải nhất quán với Schedule model.
- Không chấp nhận khoảng thời gian không hợp lệ.

**Duration:**

Duration có thể được xác định từ Start Time và End Time:

```text
Duration = End Time - Start Time
```

Duration ở đây là thời lượng dự kiến, không phải thời lượng thực thi.

**Time Zone:**

Time-zone handling vẫn là OPEN.

Các vấn đề cần được xác định trong C07:

- Lưu thời gian theo UTC hay local time.
- Time zone được xác định theo User hay từng Schedule.
- Xử lý thay đổi múi giờ.
- Xử lý thời gian không tồn tại hoặc bị lặp khi chuyển đổi DST.

B07 không được tự chọn một chiến lược Time Zone chính thức khi DEC-017 chưa được phê duyệt.

---

#### 5. Core Functions

##### B07.1. Create Daily Plan

**Purpose:** Tạo Daily Plan cho một ngày cụ thể.

**Input:**

- Date.

**Processing:**

1. Resolve Current User Context.
2. Validate Date.
3. Check existing Daily Plan according to approved uniqueness rules.
4. Create Daily Plan.
5. Persist Daily Plan.
6. Return created Daily Plan.

**Output:**

- Daily Plan.

**Rules:**

- Daily Plan phải thuộc về User hiện tại.
- Date phải hợp lệ.
- Không tạo Daily Plan trùng nếu uniqueness rule đã được phê duyệt.
- Không tự động tạo Actions khi tạo Daily Plan.

##### B07.2. Get Daily Plan

**Purpose:** Truy xuất Daily Plan theo ngày.

**Input:**

- Date.

**Processing:**

1. Resolve Current User Context.
2. Validate Date.
3. Retrieve Daily Plan.
4. Retrieve related Schedule Entries.
5. Return Daily Plan and scheduled Actions.

**Output:**

- Daily Plan.
- Related Schedule Entries.

**Rules:**

- Chỉ trả về dữ liệu thuộc User hiện tại.
- Nếu chưa có Daily Plan, xử lý theo approved retrieval policy.
- Không tự tạo Daily Plan chỉ vì người dùng truy xuất một ngày chưa có kế hoạch.

##### B07.3. Update Daily Plan

**Purpose:** Cập nhật thông tin Daily Plan theo các trường được hỗ trợ.

**Input:**

- Daily Plan ID.
- Updated fields supported by approved model.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Daily Plan.
3. Validate ownership.
4. Validate updated fields.
5. Persist changes.
6. Return updated Daily Plan.

**Rules:**

- Không cho phép cập nhật Daily Plan của User khác.
- Không được làm mất Schedule Entries hợp lệ khi cập nhật Daily Plan.
- Việc thay đổi ngày của Daily Plan phải tuân theo quy tắc Schedule relationship đã được phê duyệt.

##### B07.4. Add Action to Daily Plan

**Purpose:** Thêm một Action vào Daily Plan thông qua Schedule.

**Input:**

- Daily Plan ID.
- Action ID.
- Start Time.
- End Time.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Daily Plan.
3. Validate Daily Plan ownership.
4. Retrieve Action through B05.
5. Validate Action accessibility and availability.
6. Validate Start Time and End Time.
7. Validate Schedule relationship.
8. Validate time conflicts according to approved rules.
9. Create Schedule Entry.
10. Persist Schedule Entry.
11. Return updated Daily Plan information.

**Output:**

- Created Schedule Entry.
- Updated Daily Plan information.

**Rules:**

- B07 không tạo Action.
- Action phải tồn tại và thuộc dữ liệu người dùng có quyền truy cập.
- Schedule phải tham chiếu đến Action hợp lệ.
- Không thay đổi Action status khi thêm vào Daily Plan.
- Không tự động ghi nhận Action Execution Data.

##### B07.5. Remove Action from Daily Plan

**Purpose:** Gỡ một Action khỏi Daily Plan.

**Input:**

- Daily Plan ID.
- Schedule ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Daily Plan.
3. Validate ownership.
4. Retrieve Schedule Entry.
5. Validate Schedule relationship.
6. Remove the Schedule Entry from the Daily Plan according to approved relationship rules.
7. Persist changes.
8. Return updated Daily Plan information.

**Rules:**

- Removing an Action from a Daily Plan does not delete the Action.
- Không thay đổi Action status.
- Không xóa Execution Data.
- Nếu Schedule Entry được dùng bởi nhiều ngữ cảnh, việc gỡ khỏi Daily Plan phải tuân theo approved relationship rules.

##### B07.6. Create Schedule Entry

**Purpose:** Tạo một Schedule Entry mới cho Action.

**Input:**

- Action ID.
- Start Time.
- End Time.
- Daily Plan ID (optional, subject to approved model).

**Processing:**

1. Resolve Current User Context.
2. Validate Action through B05.
3. Validate Daily Plan if provided.
4. Validate datetime information.
5. Validate Action–Schedule relationship.
6. Validate time conflicts.
7. Create Schedule Entry.
8. Persist Schedule Entry.
9. Return created Schedule Entry.

**Rules:**

- Schedule phải thuộc dữ liệu User hiện tại.
- Schedule phải tham chiếu đến Action hợp lệ.
- Không tạo Schedule với khoảng thời gian không hợp lệ.
- Không tự động thay đổi Action hoặc Goal.

##### B07.7. Get Schedule Entry

**Purpose:** Truy xuất một Schedule Entry.

**Input:**

- Schedule ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Schedule Entry.
3. Validate ownership through its related Action and approved ownership rules.
4. Return Schedule Entry.

**Output:**

- Schedule Entry.

**Rules:**

- Không trả về Schedule thuộc User khác.
- Schedule không tồn tại phải trả về lỗi tương ứng.

##### B07.8. Update Schedule Entry

**Purpose:** Cập nhật thời gian dự kiến của một Schedule Entry.

**Input:**

- Schedule ID.
- Start Time (optional).
- End Time (optional).
- Other approved schedule fields (optional).

**Processing:**

1. Resolve Current User Context.
2. Retrieve Schedule Entry.
3. Validate ownership.
4. Validate updated datetime fields.
5. Validate Schedule relationships.
6. Validate time conflicts.
7. Persist updated Schedule.
8. Return updated Schedule Entry.

**Rules:**

- Không cập nhật Schedule thuộc User khác.
- Start Time và End Time phải hợp lệ.
- Không thay đổi Action Execution Data.
- Không thay đổi Action status chỉ vì Schedule được chỉnh sửa.

##### B07.9. Delete Schedule Entry

**Purpose:** Xóa một Schedule Entry.

**Input:**

- Schedule ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Schedule Entry.
3. Validate ownership.
4. Validate deletion rules.
5. Delete Schedule Entry.
6. Return operation result.

**Rules:**

- Xóa Schedule không đồng nghĩa với xóa Action.
- Không xóa Action Execution Data.
- Không tự động xóa Daily Plan nếu Daily Plan không còn Schedule Entries.
- Lịch sử Schedule deletion và khả năng khôi phục vẫn là OPEN.

##### B07.10. Get Schedules by Date Range

**Purpose:** Truy xuất các Schedule Entries trong một khoảng thời gian.

**Input:**

- Start Date.
- End Date.

**Processing:**

1. Resolve Current User Context.
2. Validate Start Date.
3. Validate End Date.
4. Validate date range.
5. Retrieve Schedule Entries belonging to User.
6. Filter entries by requested date range.
7. Return results in the approved ordering.

**Output:**

- List of Schedule Entries.

**Rules:**

- End Date không được trước Start Date.
- Chỉ trả về Schedule của User hiện tại.
- Không trả về Schedule ngoài khoảng thời gian được yêu cầu.
- Date range phải được xử lý nhất quán theo approved Time Zone rules.

##### B07.11. Apply Approved Planning Proposal

**Purpose:** Áp dụng một AI-proposed Daily Plan sau khi người dùng phê duyệt.

**Input:**

- User-approved Planning Proposal.
- Related Action IDs.
- Proposed Schedule information.

**Processing:**

1. Receive approved proposal from B10 workflow.
2. Validate user approval.
3. Resolve Current User Context.
4. Validate proposed Actions through B05.
5. Validate Schedule information.
6. Validate date and time constraints.
7. Validate conflicts according to approved rules.
8. Apply changes through the same Planning operations used by Manual Planning.
9. Persist approved Daily Plan and Schedule changes.
10. Return applied results.

**Rules:**

- AI proposal không phải dữ liệu Planning chính thức.
- Không lưu proposal thành Daily Plan chính thức trước khi được User phê duyệt.
- AI không được trực tiếp ghi Schedule vào Database.
- AI-approved Planning phải sử dụng cùng validation và application workflow với Manual Planning.
- Không áp dụng những thay đổi vượt quá phạm vi được User phê duyệt.
- Việc áp dụng nhiều Schedule Entries phải xử lý tính toàn vẹn dữ liệu theo transaction rules được xác định trong thiết kế.

---

#### 6. Action–Schedule Relationship

Schedule đại diện cho thời gian dự kiến dành cho một Action.

**Responsibilities:**

- B05 sở hữu Action.
- B07 sở hữu Schedule.
- B07 xác thực Action thông qua B05.
- B07 không trực tiếp quản lý Action status hoặc Execution Data.

**Conceptual Relationship:**

```text
Goal
 │
 └── Action
      │
      ├── Schedule Entry
      ├── Schedule Entry
      └── Schedule Entry
```

Sơ đồ trên chỉ minh họa khả năng một Action có nhiều Schedule Entries; cardinality chính thức vẫn là OPEN.

**Rules:**

- Schedule phải liên kết với Action hợp lệ.
- Schedule không được tạo ra Action mới.
- Schedule không được thay đổi Goal hoặc Milestone.
- Việc Action bị archive hoặc delete phải được phối hợp với B05.
- Không tự động xóa Execution Data khi Schedule bị xóa.

**OPEN Decisions:**

- Một Action có thể có nhiều Schedule Entries không?
- Một Schedule Entry có thể chứa nhiều Actions không?
- Action đã COMPLETED có thể được Schedule lại không?
- Action đã ARCHIVED có thể còn Schedule không?
- Khi Action bị xóa, Schedule Entries được xử lý như thế nào?

---

#### 7. Daily Plan–Schedule Relationship

Daily Plan là kế hoạch của User trong một ngày.

Schedule đại diện cho thời gian dự kiến của Action.

**Conceptual Relationship:**

```text
User
 │
 └── Daily Plan — Date
      │
      ├── Schedule Entry
      │    └── Action
      │
      ├── Schedule Entry
      │    └── Action
      │
      └── Schedule Entry
           └── Action
```

**Rules:**

- Daily Plan thuộc về một User.
- Daily Plan đại diện cho một ngày cụ thể.
- Schedule Entries cung cấp dữ liệu để xây dựng Daily Plan.
- Việc thêm hoặc gỡ Schedule khỏi Daily Plan không đồng nghĩa với việc tạo hoặc xóa Action.
- Daily Plan không được lưu một bản sao độc lập của Action data.
- Calendar và Planning Interface phải hiển thị cùng dữ liệu Schedule.

**OPEN Decisions:**

- Một User có tối đa một Daily Plan mỗi ngày không?
- Daily Plan có được tồn tại mà không có Schedule Entries không?
- Schedule Entry có bắt buộc thuộc một Daily Plan không?
- Khi Schedule chuyển sang ngày khác, Daily Plan được cập nhật như thế nào?
- Daily Plan có cần trạng thái riêng không?

---

#### 8. Manual Planning and Calendar Integration

B07 cung cấp các operation dùng chung cho Manual Planning và Calendar.

**Manual Planning Workflow:**

```text
User
 │
 ▼
Planning Interface
 │
 ▼
B07 Application Operations
 │
 ├── Validate Daily Plan
 ├── Validate Action
 ├── Validate Date / Time
 ├── Validate Schedule
 │
 ▼
Persistence
 │
 ▼
Updated Daily Plan
```

**Calendar Workflow:**

```text
User
 │
 ▼
Calendar Interface
 │
 ▼
B07 Application Operations
 │
 ├── Retrieve Schedules
 ├── Create Schedule
 ├── Update Schedule
 └── Delete Schedule
 │
 ▼
Persistence
 │
 ▼
Updated Calendar Data
```

**Rules:**

- Calendar không sở hữu Schedule data.
- Calendar không được trực tiếp cập nhật Database.
- Mọi thao tác từ Calendar phải đi qua B07.
- Planning Interface và Calendar phải phản ánh cùng một trạng thái dữ liệu.
- Không tạo business rules riêng cho Calendar.

---

#### 9. AI-assisted Planning Integration

B07 hỗ trợ AI-assisted Planning thông qua việc áp dụng các proposal đã được User phê duyệt.

**AI Planning Workflow:**

```text
User
 │
 ▼
B10 — AI Orchestration
 │
 ▼
AI Daily Plan Proposal
 │
 ▼
User Review and Approval
 │
 ▼
B07 — Apply Approved Proposal
 │
 ▼
Validate Actions and Schedules
 │
 ▼
Shared Planning Operations
 │
 ▼
Persist Approved Plan
```

**Rules:**

- B10 chịu trách nhiệm tạo và quản lý AI proposal.
- B07 chịu trách nhiệm áp dụng proposal vào Planning data.
- AI proposal phải được phân biệt với dữ liệu chính thức.
- User phải có quyền xem xét, chỉnh sửa, chấp nhận hoặc từ chối proposal.
- AI không được bỏ qua B07 để ghi trực tiếp Schedule.
- Manual Planning và AI-assisted Planning phải dùng chung Domain Rules.
- Nếu proposal không hợp lệ, B07 phải từ chối áp dụng các thay đổi không hợp lệ.

DEC-012 và DEC-013 trong Master Blueprint xác nhận Manual Planning và AI-assisted Planning dùng chung Planning model và Basic AI Daily Plan proposal thuộc MVP.

---

#### 10. Application Operations

B07 cung cấp application operations dùng chung cho Planning, Calendar và AI-approved Planning.

**Required Operations:**

| Operation | Responsibility |
|---|---|
| CreateDailyPlan | Create Daily Plan |
| GetDailyPlan | Retrieve Daily Plan |
| UpdateDailyPlan | Update Daily Plan |
| AddActionToDailyPlan | Add Action through Schedule |
| RemoveActionFromDailyPlan | Remove Action from Daily Plan |
| CreateSchedule | Create Schedule Entry |
| GetSchedule | Retrieve Schedule Entry |
| UpdateSchedule | Update Schedule Entry |
| DeleteSchedule | Delete Schedule Entry |
| GetSchedulesByDateRange | Retrieve schedules by date range |
| ApplyApprovedPlanningProposal | Apply User-approved AI proposal |

**Rules:**

- Mọi operation phải sử dụng Current User Context từ B01.
- Mọi operation phải xác thực ownership.
- Action validation phải sử dụng B05.
- Date and Time validation phải được thực hiện ở Backend/Domain.
- Persistence phải thông qua D01.
- Không để Frontend trực tiếp ghi Schedule vào Database.
- Không tạo hai bộ application operations riêng cho Manual và AI Planning.
- Không để Calendar triển khai business logic riêng.

Tên operation là logical names, chưa phải API route hoặc function signature chính thức.

---

#### 11. Error Handling

B07 cần xử lý các lỗi liên quan đến Planning và Scheduling.

| Error Code | Description |
|---|---|
| DAILY_PLAN_NOT_FOUND | Daily Plan không tồn tại |
| DAILY_PLAN_ACCESS_DENIED | Không có quyền truy cập Daily Plan |
| DAILY_PLAN_ALREADY_EXISTS | Daily Plan đã tồn tại theo uniqueness rule |
| DAILY_PLAN_INVALID_DATE | Date không hợp lệ |
| SCHEDULE_NOT_FOUND | Schedule không tồn tại |
| SCHEDULE_ACCESS_DENIED | Không có quyền truy cập Schedule |
| SCHEDULE_INVALID_START_TIME | Start Time không hợp lệ |
| SCHEDULE_INVALID_END_TIME | End Time không hợp lệ |
| SCHEDULE_INVALID_TIME_RANGE | End Time không sau Start Time |
| SCHEDULE_INVALID_DATE_RANGE | Date range không hợp lệ |
| SCHEDULE_CONFLICT | Schedule conflict theo approved rules |
| SCHEDULE_ACTION_NOT_FOUND | Action không tồn tại |
| SCHEDULE_ACTION_INVALID | Action không hợp lệ để Schedule |
| SCHEDULE_INVALID_RELATIONSHIP | Schedule relationship không hợp lệ |
| PLANNING_PROPOSAL_INVALID | AI Planning proposal không hợp lệ |
| PLANNING_APPROVAL_REQUIRED | Chưa có User approval |
| PLANNING_VALIDATION_FAILED | Planning validation thất bại |
| PLANNING_PERSISTENCE_ERROR | Lỗi lưu trữ dữ liệu |

**Rules:**

- Error phải có ý nghĩa rõ ràng.
- Không trả về thông tin nhạy cảm.
- Không tiết lộ Schedule hoặc Daily Plan thuộc User khác.
- Không trả về lỗi Database nội bộ trực tiếp cho Client.
- Các lỗi phải sử dụng shared error handling từ D06.

---

#### 12. Dependencies

**Internal Dependencies:**

| Module | Dependency |
|---|---|
| B01 — Authentication & User Context | Current User Context |
| B05 — Action Management | Action retrieval and validation |
| B08 — Progress Engine | Schedule is not a progress calculation source |
| B09 — Review Management | Planned data for comparison with actual execution |
| B10 — AI Orchestration | Approved Planning Proposals |

**Domain Dependencies:**

- C01 — Identity & Ownership Rules.
- C05 — Action Rules.
- C07 — Planning & Schedule Rules.
- C09 — Review Rules.

**Infrastructure Dependencies:**

- D01 — Database & Persistence.
- D03 — Shared Types & Contracts.
- D04 — Validation.
- D05 — API / Application Communication.
- D06 — Error Handling.
- D07 — Logging & Observability.
- D08 — Security & Configuration.

**Frontend Dependencies:**

- A07 — Planning Interface.
- A08 — Calendar Interface.
- A10 — AI Assistant Interface.
- A11 — Shared UI Components.

---

#### 13. Security Requirements

B07 phải bảo vệ Planning và Schedule data của từng User.

**Authentication:**

- Mọi Planning operation yêu cầu authenticated user.
- Không cho phép truy cập Daily Plan hoặc Schedule khi không có Current User Context hợp lệ.

**Authorization:**

- Daily Plan phải thuộc User hiện tại.
- Schedule phải được xác thực ownership thông qua Action và các relationship rules.
- Action phải được kiểm tra quyền truy cập thông qua B05.
- Backend không được tin tưởng User ID do Frontend tự gửi.

**Data Integrity:**

- Không cho phép Schedule tham chiếu đến Action không tồn tại.
- Không cho phép Schedule tham chiếu đến Action thuộc User khác.
- Không cho phép Start Time và End Time không hợp lệ.
- Không được xóa Action khi chỉ có yêu cầu xóa Schedule.
- Không được để Calendar tạo bản sao dữ liệu Schedule.

**AI Security:**

- Không tin tưởng trực tiếp AI-generated Schedule.
- AI proposal phải được validate.
- Chỉ áp dụng proposal đã được User phê duyệt.
- Không cho phép AI ghi trực tiếp vào Planning persistence.

---

#### 14. Acceptance Criteria

B07 được xem là đáp ứng yêu cầu MVP khi:

- [ ] User có thể tạo Daily Plan.
- [ ] User có thể truy xuất Daily Plan theo ngày.
- [ ] User có thể cập nhật Daily Plan.
- [ ] User có thể thêm Action vào Daily Plan thông qua Schedule.
- [ ] User có thể gỡ Action khỏi Daily Plan.
- [ ] User có thể tạo Schedule Entry.
- [ ] User có thể truy xuất Schedule Entry.
- [ ] User có thể cập nhật Schedule Entry.
- [ ] User có thể xóa Schedule Entry.
- [ ] User có thể truy xuất Schedules theo Date Range.
- [ ] Hệ thống xác thực Action trước khi tạo Schedule.
- [ ] Hệ thống xác thực Date và Time trước khi lưu.
- [ ] Hệ thống kiểm tra Schedule conflicts theo approved rules.
- [ ] Calendar sử dụng cùng application operations với Planning.
- [ ] Manual Planning và AI-approved Planning sử dụng cùng Planning model.
- [ ] AI proposal không trở thành dữ liệu chính thức trước User approval.
- [ ] Xóa Schedule không tự động xóa Action.
- [ ] Planned time không bị nhầm lẫn với Actual Execution Time.
- [ ] User không thể truy cập Planning data của User khác.
- [ ] Các lỗi được trả về theo shared error handling.

---

#### 15. Testing Requirements

**Unit Tests**

- Daily Plan input validation.
- Daily Plan ownership validation.
- Daily Plan date validation.
- Schedule input validation.
- Start Time validation.
- End Time validation.
- Date Range validation.
- Action–Schedule relationship validation.
- Schedule conflict validation.
- Daily Plan–Schedule relationship validation.
- Approved Planning Proposal validation.

**Integration Tests**

- Create Daily Plan.
- Retrieve Daily Plan.
- Update Daily Plan.
- Add Action to Daily Plan.
- Remove Action from Daily Plan.
- Create Schedule Entry.
- Retrieve Schedule Entry.
- Update Schedule Entry.
- Delete Schedule Entry.
- Retrieve Schedules by Date Range.
- Action ownership validation through B05.
- Daily Plan persistence.
- Schedule persistence.
- Calendar interaction through shared B07 operations.
- AI-approved Planning through shared B07 operations.

**Security Tests**

- Unauthenticated Planning request.
- Access another User's Daily Plan.
- Access another User's Schedule.
- Create Schedule for another User's Action.
- Forge User ID from Frontend.
- Apply unapproved AI proposal.
- Apply invalid AI-generated Schedule.

**Data Integrity Tests**

- Invalid Start Time.
- Invalid End Time.
- End Time before Start Time.
- Invalid Date Range.
- Schedule with missing Action.
- Schedule with invalid Daily Plan relationship.
- Schedule conflict according to approved rules.
- Delete Schedule without deleting Action.
- Update Schedule without modifying Execution Data.

**End-to-End Tests**

1. Create Daily Plan → Add Action → Create Schedule → Retrieve Daily Plan.
2. Create Schedule → Update Time → Verify Calendar reflects changes.
3. Create Schedule → Delete Schedule → Verify Action still exists.
4. Retrieve Schedules by Date Range → Verify correct results.
5. AI proposal → User approval → Apply through B07 → Verify Daily Plan.
6. User A → Attempt to access User B's Schedule → Rejected.

---

#### 16. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Finalize Planning and Schedule Domain Rules | C07 |
| 2 | Finalize Daily Plan and Schedule relationship | C07 |
| 3 | Resolve Schedule cardinality and time-zone rules | DEC-017 |
| 4 | Define Daily Plan and Schedule contracts | C07, D03 |
| 5 | Prepare persistence schema | D01 |
| 6 | Implement date and time validation | D04 |
| 7 | Implement ownership and Action validation | B01, B05 |
| 8 | Implement Create and Retrieve Daily Plan | D01, D04 |
| 9 | Implement Add and Remove Action operations | B05, D01 |
| 10 | Implement Schedule CRUD operations | D01, D04 |
| 11 | Implement Schedule retrieval by date range | D01 |
| 12 | Integrate Planning Interface | A07 |
| 13 | Integrate Calendar Interface | A08 |
| 14 | Integrate AI-approved Planning workflow | B10 |
| 15 | Run integration and security tests | Required dependencies |

Triển khai theo từng bước nhỏ.

Ưu tiên xây dựng shared Planning operations trước khi tích hợp các giao diện Manual Planning, Calendar và AI-assisted Planning.

Không triển khai các cơ chế Recurrence hoặc Automatic Schedule Optimization khi chưa có yêu cầu MVP được phê duyệt.

---

#### 17. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Recurring Schedule.
- External Calendar Synchronization.
- Google Calendar Integration.
- Outlook Calendar Integration.
- Advanced Calendar Views.
- Automatic Schedule Optimization.
- Schedule Recommendation Engine.
- Smart Conflict Resolution.
- Team Scheduling.
- Shared Calendar.
- Schedule Notifications.
- Advanced Time Tracking.
- Automatic Rescheduling.
- AI Autonomous Schedule Adjustment.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

---

#### 18. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Schedule Purpose | APPROVED BY BLUEPRINT | Represents planned time for an Action |
| Daily Plan Purpose | APPROVED BY BLUEPRINT | User's plan for a particular day |
| Daily Plan Composition | APPROVED BY BLUEPRINT | Assembled from scheduled Actions |
| Shared Planning Model | APPROVED — DEC-012 | Manual and AI-assisted Planning share one model |
| AI Daily Plan Proposal | APPROVED — DEC-013 | Basic AI proposal included in MVP |
| AI Proposal Approval | APPROVED — DEC-014 | User approval required before official data changes |
| Daily Plan Cardinality | OPEN — C07 | To be defined |
| Schedule Cardinality | OPEN — DEC-017 | To be defined |
| Schedule–Action Relationship | OPEN — C07 | To be defined |
| Daily Plan–Schedule Relationship | OPEN — C07 | To be defined |
| Schedule Recurrence | OPEN — DEC-017 | To be defined |
| Time Zone Handling | OPEN — DEC-017 | To be defined |
| Schedule Conflict Rules | OPEN — DEC-017 | To be defined |
| Schedule Deletion Policy | OPEN — C07 | To be defined |
| Action Archive/Delete Effects | OPEN — C05/C07 | To be coordinated with B05 |
| Actual Execution Data | B05 RESPONSIBILITY | Not managed by B07 |
| Database Technology | OPEN — D01 | Defined in D01 |

**Outstanding Product Owner Decisions:**

| ID | Decision | Question |
|---|---|---|
| PLANNING-001 | Daily Plan Cardinality | Does each User have exactly one Daily Plan per day? |
| PLANNING-002 | Schedule Cardinality | Can one Action have multiple Schedule Entries? |
| PLANNING-003 | Daily Plan Relationship | Must every Schedule Entry belong to a Daily Plan? |
| PLANNING-004 | Time Zone Strategy | Should timestamps be stored in UTC and interpreted using the User's time zone? |
| PLANNING-005 | Schedule Conflicts | Can multiple Actions be scheduled at overlapping times? |
| PLANNING-006 | Schedule Duration | Must every Schedule Entry have both Start Time and End Time? |
| PLANNING-007 | Schedule Recurrence | Is recurring scheduling excluded entirely from MVP? |
| PLANNING-008 | Completed Actions | Can completed Actions be scheduled again? |
| PLANNING-009 | Archived/Deleted Actions | What happens to related Schedule Entries? |
| PLANNING-010 | Daily Plan Lifecycle | Does Daily Plan need its own status or is it derived from its date and Schedule Entries? |
| PLANNING-011 | Schedule History | Should deleted or changed Schedule Entries retain historical records? |

Các quyết định trên cần được Product Owner phê duyệt trước khi triển khai các chức năng phụ thuộc vào chúng.

---

#### 19. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED

**Development Status:** PARTIALLY AVAILABLE.

**Implementation Status:** NOT_STARTED.

**Available Core Work:**

- Define Daily Plan and Schedule contracts.
- Implement basic Daily Plan persistence.
- Implement Schedule CRUD operations.
- Implement Action ownership validation through B05.
- Implement basic Date and Time validation.
- Implement Schedule retrieval by date range.
- Build shared Planning application operations.

**Remaining Dependencies:**

- C07: Finalize Planning and Schedule Domain Rules.
- DEC-017: Resolve Schedule cardinality, recurrence, and time-zone rules.
- D01: Provide Daily Plan and Schedule persistence.
- D03: Provide shared Planning types.
- D04: Provide Date and Time validation.
- D06: Provide shared error handling.
- B01: Provide Current User Context.
- B05: Provide Action retrieval and validation.
- B10: Provide approved AI Planning proposals.
- A07: Integrate Planning Interface.
- A08: Integrate Calendar Interface.

**Final Implementation Rule:**

B07 owns Daily Plan and Schedule management only.

B05 remains the owner of Action data and execution information.

Manual Planning, Calendar interactions, and AI-approved Planning must use the same application operations and underlying Schedule model.

Do not treat planned time as actual execution time. Do not allow AI proposals to modify official Planning data before User approval. Do not introduce recurrence, advanced scheduling, or automatic optimization before the relevant Domain Rules are approved.

The MVP implementation should prioritize reliable Daily Plan management, Schedule CRUD, date and time validation, and shared workflows across Planning, Calendar, and AI-approved Planning.

# B08. Progress Engine

**Architecture Status:** APPROVED — MVP SCOPE  
**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED  
**Development Status:** PARTIALLY AVAILABLE  
**Implementation Status:** NOT_STARTED  
**Dependencies Status:** PARTIALLY AVAILABLE  
**Priority:** MVP — REQUIRED

---

#### 1. Purpose

B08 chịu trách nhiệm tính toán và cung cấp thông tin tiến độ chính thức cho FLOW-UP.

Mục tiêu là tổng hợp dữ liệu từ các module quản lý nghiệp vụ để đánh giá mức độ hoàn thành của:

- Measurement.
- Action.
- Goal.
- Goal hierarchy, where applicable.

B08 là nơi duy nhất chịu trách nhiệm thực hiện authoritative progress calculations.

Các module khác có thể cung cấp dữ liệu đầu vào hoặc hiển thị kết quả, nhưng không được tự triển khai các công thức tính tiến độ độc lập.

B08 không sở hữu Goal, Action hoặc Measurement. B08 chỉ đọc dữ liệu từ các module tương ứng và thực hiện các phép tính theo Domain Rules đã được phê duyệt.

**Core Principle:**

Progress must be calculated from validated domain data using explicitly approved calculation rules.

Không được tự đặt công thức tính tiến độ trong quá trình triển khai nếu Product Owner chưa phê duyệt.

---

#### 2. MVP Scope

**Included:**

- Calculate Measurement Progress where applicable.
- Calculate Action Completion.
- Calculate Goal Progress.
- Aggregate Child Goal Progress where applicable.
- Provide Goal Progress Summary.
- Provide Action Completion Summary.
- Provide Measurement Progress Summary.
- Compare Actual Measurement Values with Targets.
- Retrieve Progress Data for Application Interfaces.
- Provide Progress Data to Review Management.
- Validate Input Data before Calculation.
- Handle Missing or Invalid Progress Data.
- Centralized Progress Calculation Rules.

**Excluded:**

- Advanced Predictive Progress Analysis.
- AI-generated Progress Calculations.
- Automatic Goal Adjustment.
- Automatic Action Status Changes.
- Advanced Statistical Analysis.
- Advanced Performance Analytics.
- Complex Productivity Scoring.
- Automatic Goal Completion.
- Autonomous Goal Progress Optimization.
- Advanced Progress Forecasting.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi sản phẩm có nhu cầu thực tế.

---

#### 3. Progress Model

B08 tính toán tiến độ dựa trên dữ liệu được quản lý bởi các module nghiệp vụ.

**A. Measurement Progress**

Measurement Progress phản ánh mức độ đạt được của một Measurement so với Target Value khi Measurement có mục tiêu phù hợp.

Ví dụ:

```text
Measurement: IELTS Overall
Current Value: 6.0
Target Value: 7.0
```

B08 sử dụng Measurement Definition và Record từ B06 để tính toán kết quả theo approved rules.

Không phải Measurement nào cũng có Target Value hoặc có thể tính phần trăm tiến độ.

**B. Action Completion**

Action Completion phản ánh trạng thái hoàn thành của các Actions liên quan đến Goal.

Ví dụ:

```text
Goal: Complete Python Course
│
├── Action A — COMPLETED
├── Action B — COMPLETED
├── Action C — IN_PROGRESS
└── Action D — TODO
```

B08 sử dụng Action status từ B05.

**C. Goal Progress**

Goal Progress phản ánh mức độ đạt được của một Goal dựa trên các nguồn dữ liệu tiến độ được hỗ trợ.

Các nguồn dữ liệu có thể bao gồm:

- Measurement Progress.
- Action Completion.
- Child Goal Progress.

Việc kết hợp các nguồn này phải tuân theo approved Goal Progress Rules.

**D. Child Goal Aggregation**

Goal có thể có các Goal con với nhiều cấp độ phân rã.

B08 có thể tổng hợp tiến độ của các Child Goals để cung cấp thông tin cho Parent Goal khi được phép theo Domain Rules.

**Important Rules:**

- Measurement Progress, Action Completion và Goal Progress là các kết quả khác nhau.
- Không được mặc định chúng có cùng ý nghĩa hoặc cùng cách tính.
- Không được tự động cộng hoặc lấy trung bình các loại tiến độ khác nhau.
- Không được coi một Goal có nhiều Child Goals là tự động có tiến độ bằng trung bình tiến độ của các Goal con.
- Calculation Rules phải được xác định trong C08.

---

#### 4. Progress Calculation Rules

B08 thực hiện các phép tính dựa trên quy tắc được định nghĩa và phê duyệt trong C08 — Progress Rules.

**Calculation Requirements:**

- Sử dụng dữ liệu hợp lệ từ các module nguồn.
- Xác định rõ nguồn dữ liệu của từng phép tính.
- Không sử dụng dữ liệu chưa được xác thực.
- Không áp dụng công thức ngoài approved rules.
- Xử lý trường hợp thiếu dữ liệu.
- Xử lý trường hợp không có Target Value.
- Xử lý trường hợp không có Actions hoặc Child Goals.
- Không tự động thay đổi trạng thái nghiệp vụ khi tính toán.

**Proposed Measurement Progress Example:**

Với Measurement có Target Value lớn hơn giá trị ban đầu và tiến độ tăng theo giá trị thực tế:

\[
Progress = \frac{Current - Baseline}{Target - Baseline}\times 100
\]

Tuy nhiên, công thức trên chỉ là ví dụ.

Công thức thực tế có thể khác tùy theo Measurement:

- Giá trị càng cao càng tốt.
- Giá trị càng thấp càng tốt.
- Giá trị cần đạt một khoảng xác định.
- Giá trị dạng Boolean hoặc Text.
- Measurement không có Baseline.

Không được mặc định sử dụng một công thức chung cho mọi Measurement.

**Proposed Action Completion Example:**

\[
Completion = \frac{Completed\ Actions}{Total\ Actions}\times 100
\]

Đây cũng chỉ là ví dụ.

Các yếu tố cần được phê duyệt:

- Action nào được tính vào tổng số?
- Action bị archived có được tính không?
- Action bị cancelled có được tính không?
- Có hỗ trợ weighted Actions không?
- Có tính Action thuộc Milestone theo cách riêng không?

**Proposed Goal Progress Example:**

Goal Progress có thể được xác định từ:

- Measurement Progress.
- Action Completion.
- Child Goal Progress.

Tuy nhiên, trọng số, thứ tự ưu tiên, điều kiện áp dụng và cách xử lý dữ liệu thiếu đều phải được phê duyệt.

**Final Rule:**

Không triển khai các công thức ví dụ trên thành authoritative business logic trước khi C08 và Product Owner xác nhận.

---

#### 5. Core Functions

##### B08.1. Calculate Measurement Progress

**Purpose:** Tính toán tiến độ của Measurement khi Measurement có thể áp dụng Progress Rules.

**Input:**

- Measurement ID.
- Measurement Definition.
- Current Measurement Value.
- Target Value, if applicable.
- Additional calculation inputs required by approved rules.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement data through B06.
3. Validate Measurement ownership.
4. Validate Measurement Definition.
5. Retrieve required Measurement Records.
6. Identify whether the Measurement supports progress calculation.
7. Validate calculation inputs.
8. Apply approved Measurement Progress Rules.
9. Return calculated progress result.

**Output:**

- Measurement ID.
- Current Value.
- Target Value, if applicable.
- Progress Value, if applicable.
- Calculation Status.
- Calculation Context.

**Rules:**

- Không tính tiến độ cho Measurement không hỗ trợ phép tính tương ứng.
- Không tự tạo Target Value.
- Không tự chọn Baseline nếu chưa có approved rule.
- Không thay đổi Measurement Definition hoặc Measurement Record.
- Không sử dụng dữ liệu sai Value Type hoặc Unit.
- Không mặc định mọi Measurement đều có thể biểu diễn bằng phần trăm.

##### B08.2. Calculate Action Completion

**Purpose:** Tính toán mức độ hoàn thành của các Actions theo Goal hoặc phạm vi được yêu cầu.

**Input:**

- Goal ID or supported Action scope.
- Related Actions.
- Action Status.
- Additional calculation inputs required by approved rules.

**Processing:**

1. Resolve Current User Context.
2. Retrieve relevant Actions through B05.
3. Validate ownership and relationships.
4. Retrieve Action status information.
5. Identify Actions eligible for calculation.
6. Apply approved Action Completion Rules.
7. Return completion result.

**Output:**

- Total Actions.
- Completed Actions.
- Incomplete Actions.
- Action Completion Value.
- Calculation Status.

**Rules:**

- B08 không cập nhật Action status.
- B08 không hoàn thành Action thay người dùng.
- Không tự quyết định cách xử lý Archived hoặc Cancelled Actions.
- Không tự tính trọng số cho Actions.
- Action Completion Rules phải được phê duyệt trong C08.

##### B08.3. Calculate Goal Progress

**Purpose:** Tính toán tiến độ của một Goal.

**Input:**

- Goal ID.
- Related Measurement Progress.
- Related Action Completion.
- Child Goal Progress, where applicable.
- Additional calculation inputs required by approved rules.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Goal through B03.
3. Validate Goal ownership.
4. Retrieve related progress data.
5. Validate data relationships.
6. Identify applicable progress sources.
7. Apply approved Goal Progress Rules.
8. Return Goal Progress result.

**Output:**

- Goal ID.
- Goal Progress Value, if applicable.
- Progress Status.
- Contributing Progress Sources.
- Calculation Context.

**Rules:**

- Goal Progress phải tuân theo C08.
- Không tự động coi Measurement Progress là Goal Progress.
- Không tự động lấy trung bình Action Completion và Measurement Progress.
- Không tự thay đổi Goal status.
- Không tự hoàn thành Goal khi Progress đạt 100%.
- Không trả về một giá trị phần trăm giả định khi dữ liệu không đủ để tính.

##### B08.4. Aggregate Child Goal Progress

**Purpose:** Tổng hợp tiến độ của Child Goals cho Parent Goal khi được hỗ trợ bởi approved rules.

**Input:**

- Parent Goal ID.
- Child Goal IDs.
- Child Goal Progress results.
- Additional aggregation inputs required by approved rules.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Goal hierarchy through B03.
3. Validate Goal ownership.
4. Retrieve Child Goal Progress.
5. Validate parent-child relationships.
6. Identify applicable Child Goals.
7. Apply approved aggregation rules.
8. Return aggregated result.

**Output:**

- Parent Goal ID.
- Child Goal Progress Results.
- Aggregated Progress Value, if applicable.
- Aggregation Status.

**Rules:**

- Chỉ tổng hợp Child Goals thuộc đúng Parent Goal.
- Không chấp nhận hierarchy không hợp lệ.
- Không tự động cộng phần trăm tiến độ của các Child Goals.
- Không mặc định các Child Goals có trọng số bằng nhau.
- Không tự động thay đổi Parent Goal status.
- Không được tạo vòng lặp trong quá trình tính toán hierarchy.

##### B08.5. Get Goal Progress Summary

**Purpose:** Cung cấp thông tin tiến độ tổng quan của Goal.

**Input:**

- Goal ID.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Goal.
3. Validate ownership.
4. Retrieve applicable Measurement Progress.
5. Retrieve Action Completion.
6. Retrieve Child Goal Progress where applicable.
7. Apply approved Goal Progress Rules.
8. Build Progress Summary.
9. Return result.

**Output:**

- Goal ID.
- Goal Progress.
- Measurement Progress Summary.
- Action Completion Summary.
- Child Goal Progress Summary.
- Calculation Status.

**Rules:**

- Summary phải phản ánh dữ liệu nguồn hợp lệ.
- Không tự tính lại theo một công thức riêng trong Summary operation.
- Không trả về dữ liệu thuộc User khác.
- Không tạo Progress Value nếu calculation rules không cho phép.

##### B08.6. Get Progress Summary

**Purpose:** Cung cấp thông tin tiến độ cho các giao diện ứng dụng.

**Input:**

- Goal ID, Project ID hoặc supported scope.

**Processing:**

1. Resolve Current User Context.
2. Validate requested scope.
3. Retrieve relevant Goals and progress inputs.
4. Apply approved calculation rules.
5. Build Progress Summary.
6. Return result.

**Output:**

- Progress Summary for requested scope.
- Related Goal Progress.
- Action Completion Summary.
- Measurement Progress Summary where applicable.

**Rules:**

- Project-level aggregation chỉ được thực hiện khi Project Progress Rules được phê duyệt.
- Không tự tổng hợp tiến độ Project bằng trung bình các Goal.
- Không trả về dữ liệu ngoài phạm vi User được phép truy cập.

##### B08.7. Compare Actual Values with Targets

**Purpose:** So sánh giá trị thực tế với Target Value của Measurement.

**Input:**

- Measurement ID.
- Current Value.
- Target Value.
- Approved comparison rules.

**Processing:**

1. Resolve Current User Context.
2. Retrieve Measurement data through B06.
3. Validate ownership.
4. Validate Current Value.
5. Validate Target Value.
6. Identify comparison direction and conditions.
7. Apply approved comparison rules.
8. Return comparison result.

**Output:**

- Current Value.
- Target Value.
- Difference, where applicable.
- Target Comparison Status.
- Progress Value, where applicable.

**Rules:**

- Không mặc định giá trị càng cao càng tốt.
- Không mặc định giá trị càng thấp càng tốt.
- Comparison Direction phải dựa trên approved Measurement Rules.
- Không tự thay đổi Target Value.
- Không tự cập nhật Goal status khi đạt Target.

##### B08.8. Retrieve Progress Data for Review

**Purpose:** Cung cấp dữ liệu tiến độ cần thiết cho B09 — Review Management.

**Input:**

- Goal ID or supported Review scope.
- Optional date range.

**Processing:**

1. Resolve Current User Context.
2. Validate requested scope.
3. Retrieve available progress data.
4. Retrieve related source data or progress history where supported.
5. Apply approved calculation rules if recalculation is required.
6. Return progress information.

**Output:**

- Progress Summary.
- Available Progress History.
- Related calculation context.

**Rules:**

- B08 cung cấp dữ liệu tiến độ.
- B09 chịu trách nhiệm xây dựng Review Summary.
- Không trùng lặp Review logic trong B08.
- Progress History persistence và snapshot strategy vẫn là OPEN.

---

#### 6. Measurement Progress Integration

B08 sử dụng dữ liệu từ B06 để tính Measurement Progress khi Measurement có thể áp dụng.

**B06 Responsibilities:**

- Create Measurement Definitions.
- Record Measurement Values.
- Retrieve Current Values.
- Retrieve Measurement History.
- Validate Value Type, Unit and Target.

**B08 Responsibilities:**

- Evaluate Measurement progress where applicable.
- Compare actual values with targets.
- Apply approved calculation rules.
- Provide Measurement Progress results.

**Conceptual Flow:**

```text
B06 — Measurement Management
        │
        ├── Measurement Definition
        ├── Current Value
        ├── Target Value
        └── Measurement History
                │
                ▼
B08 — Progress Engine
                │
                ▼
Measurement Progress Result
```

**Rules:**

- B08 không quản lý Measurement Definition.
- B08 không tạo Measurement Record.
- B08 không thay đổi Measurement Value.
- Không tự tính tiến độ cho Measurement không có đủ dữ liệu.
- Không sử dụng Unit không tương thích.
- Measurement Progress phải tuân theo C08 và C06.

---

#### 7. Action Completion Integration

B08 sử dụng Action status từ B05 để tính Action Completion.

**B05 Responsibilities:**

- Manage Action.
- Update Action Status.
- Complete Action.
- Record Execution Data.

**B08 Responsibilities:**

- Retrieve relevant Action data.
- Determine eligible Actions according to approved rules.
- Calculate Action Completion.
- Provide completion summaries.

**Conceptual Flow:**

```text
B05 — Action Management
        │
        ├── Action A: COMPLETED
        ├── Action B: COMPLETED
        ├── Action C: IN_PROGRESS
        └── Action D: TODO
                │
                ▼
B08 — Progress Engine
                │
                ▼
Action Completion Result
```

**Rules:**

- B08 không thay đổi Action status.
- B08 không tự hoàn thành Actions.
- B08 không dùng Schedule để xác định Action Completion.
- Planned time không được coi là Actual Execution.
- Archived hoặc Cancelled Actions phải được xử lý theo approved rules.

---

#### 8. Goal Progress and Hierarchy Integration

B08 sử dụng Goal structure từ B03 để tính toán Goal Progress và Child Goal Aggregation.

**B03 Responsibilities:**

- Create and manage Goals.
- Retrieve Goal hierarchy.
- Validate Parent–Child relationships.
- Prevent hierarchy cycles.

**B08 Responsibilities:**

- Retrieve Goal hierarchy.
- Retrieve applicable progress inputs.
- Calculate Goal Progress.
- Aggregate Child Goal Progress where applicable.

**Conceptual Flow:**

```text
Parent Goal
    │
    ├── Child Goal A
    │       ├── Measurement Progress
    │       └── Action Completion
    │
    ├── Child Goal B
    │       ├── Measurement Progress
    │       └── Action Completion
    │
    └── Child Goal C
            ├── Measurement Progress
            └── Action Completion
                    │
                    ▼
              B08 — Progress Engine
                    │
                    ▼
             Parent Goal Progress
```

**Rules:**

- Goal hierarchy được quản lý bởi B03.
- B08 không thay đổi Parent–Child relationships.
- Không tự giả định tất cả Child Goals có mức độ quan trọng như nhau.
- Không tự động tính Parent Goal Progress bằng trung bình Child Goal Progress.
- Không tính lặp một nguồn dữ liệu khi dữ liệu đó đã được tổng hợp ở cấp dưới.
- Aggregation phải tuân theo C08.

---

#### 9. Progress Summary and Review Integration

B08 cung cấp kết quả tiến độ cho các module và giao diện liên quan.

**A09 — Progress & Review Interface:**

- Display Goal Progress.
- Display Action Completion.
- Display Measurement values and history.
- Display progress summaries.

**B09 — Review Management:**

- Retrieve progress history.
- Compare planned and actual results.
- Generate basic review summary.
- Record optional user review notes.

**B08 Responsibilities:**

- Provide authoritative progress results.
- Provide calculation context where necessary.
- Provide available progress data for Review.

**Rules:**

- UI không tự tính authoritative progress.
- B09 không triển khai lại Goal Progress calculation.
- B08 không tạo Review Notes.
- B08 không tự so sánh Planned và Actual execution.
- Việc lưu Progress History hoặc Snapshot phải tuân theo approved persistence strategy.

---

#### 10. Application Operations

B08 cung cấp các application operations để tính toán và truy xuất tiến độ.

**Required Operations:**

| Operation | Responsibility |
|---|---|
| CalculateMeasurementProgress | Calculate Measurement Progress |
| CalculateActionCompletion | Calculate Action Completion |
| CalculateGoalProgress | Calculate Goal Progress |
| AggregateChildGoalProgress | Aggregate Child Goal Progress |
| GetGoalProgressSummary | Retrieve Goal Progress Summary |
| GetProgressSummary | Retrieve Progress Summary |
| CompareMeasurementWithTarget | Compare actual value with target |
| GetProgressDataForReview | Provide progress data to B09 |

**Rules:**

- Mọi operation phải sử dụng Current User Context từ B01.
- Mọi operation phải xác thực quyền truy cập dữ liệu nguồn.
- Input data phải được kiểm tra trước khi tính toán.
- Calculation Rules phải tập trung trong C08.
- Persistence phải thông qua D01.
- Không để Frontend tự tính authoritative progress.
- Không để B05, B06 hoặc B09 tự triển khai các phép tính thuộc B08.
- Các operation phải trả về kết quả nhất quán khi sử dụng cùng dữ liệu và cùng calculation rules.

Tên operation là logical names, chưa phải API route hoặc function signature chính thức.

---

#### 11. Error Handling

B08 cần xử lý các lỗi liên quan đến Progress Calculation.

| Error Code | Description |
|---|---|
| PROGRESS_GOAL_NOT_FOUND | Goal không tồn tại |
| PROGRESS_ACCESS_DENIED | Không có quyền truy cập dữ liệu tiến độ |
| PROGRESS_MEASUREMENT_NOT_FOUND | Measurement không tồn tại |
| PROGRESS_ACTION_NOT_FOUND | Action không tồn tại |
| PROGRESS_INVALID_INPUT | Input không hợp lệ |
| PROGRESS_INVALID_MEASUREMENT_VALUE | Measurement Value không hợp lệ |
| PROGRESS_INVALID_TARGET | Target Value không hợp lệ |
| PROGRESS_INVALID_UNIT | Unit không tương thích |
| PROGRESS_INSUFFICIENT_DATA | Không đủ dữ liệu để tính toán |
| PROGRESS_UNSUPPORTED_CALCULATION | Không hỗ trợ phép tính tương ứng |
| PROGRESS_RULE_NOT_CONFIGURED | Calculation Rule chưa được cấu hình hoặc phê duyệt |
| PROGRESS_INVALID_HIERARCHY | Goal hierarchy không hợp lệ |
| PROGRESS_AGGREGATION_FAILED | Không thể tổng hợp tiến độ |
| PROGRESS_CALCULATION_FAILED | Tính toán tiến độ thất bại |
| PROGRESS_PERSISTENCE_ERROR | Lỗi lưu trữ Progress data nếu persistence được hỗ trợ |

**Rules:**

- Error phải có ý nghĩa rõ ràng.
- Không trả về thông tin nhạy cảm.
- Không tiết lộ dữ liệu tiến độ của User khác.
- Không trả về lỗi nội bộ trực tiếp cho Client.
- Các lỗi phải sử dụng shared error handling từ D06.
- Không trả về giá trị mặc định giả để thay thế cho calculation failure.

---

#### 12. Dependencies

**Internal Dependencies:**

| Module | Dependency |
|---|---|
| B01 — Authentication & User Context | Current User Context |
| B03 — Goal Management | Goal data and hierarchy |
| B05 — Action Management | Action status and execution data |
| B06 — Measurement Management | Measurement definitions, values and history |
| B09 — Review Management | Progress data and history |
| A09 — Progress & Review Interface | Display progress results |

**Domain Dependencies:**

- C01 — Identity & Ownership Rules.
- C03 — Goal & Hierarchy Rules.
- C05 — Action Rules.
- C06 — Measurement Rules.
- C08 — Progress Rules.
- C09 — Review Rules.

**Infrastructure Dependencies:**

- D01 — Database & Persistence.
- D03 — Shared Types & Contracts.
- D04 — Validation.
- D05 — API / Application Communication.
- D06 — Error Handling.
- D07 — Logging & Observability.
- D08 — Security & Configuration.

---

#### 13. Security Requirements

B08 phải đảm bảo dữ liệu tiến độ được tính toán từ dữ liệu người dùng có quyền truy cập.

**Authentication:**

- Mọi Progress operation yêu cầu authenticated user.
- Không cho phép truy xuất Progress Data khi không có Current User Context hợp lệ.

**Authorization:**

- Goal phải thuộc phạm vi dữ liệu User hiện tại.
- Measurement phải được xác thực ownership thông qua B06 và owning Goal.
- Action phải được xác thực ownership thông qua B05.
- Goal hierarchy phải thuộc cùng phạm vi dữ liệu hợp lệ.
- Không tin tưởng User ID hoặc ownership information do Frontend tự gửi.

**Data Integrity:**

- Chỉ sử dụng dữ liệu nguồn hợp lệ.
- Không sử dụng Measurement Record sai kiểu.
- Không sử dụng Action không hợp lệ.
- Không tính toán từ Goal hierarchy có cycle.
- Không ghi đè dữ liệu nguồn trong quá trình tính toán.

**Calculation Integrity:**

- Calculation Rules phải được quản lý tập trung.
- UI không được trở thành nguồn tính toán chính thức.
- Các module khác không được tự thay đổi Progress Result.
- Không cho phép Client gửi một Progress Value tùy ý để ghi đè kết quả authoritative.

---

#### 14. Acceptance Criteria

B08 được xem là đáp ứng yêu cầu MVP khi:

- [ ] Có thể tính Measurement Progress khi Measurement hỗ trợ phép tính.
- [ ] Có thể so sánh Current Measurement Value với Target Value.
- [ ] Có thể tính Action Completion từ Action data hợp lệ.
- [ ] Có thể tính Goal Progress theo approved rules.
- [ ] Có thể tổng hợp Child Goal Progress khi được hỗ trợ.
- [ ] Có thể cung cấp Goal Progress Summary.
- [ ] Có thể cung cấp Progress Summary cho các giao diện.
- [ ] Có thể cung cấp Progress Data cho B09.
- [ ] Calculation Rules được quản lý tập trung trong C08.
- [ ] Không sử dụng dữ liệu nguồn sai hoặc không hợp lệ.
- [ ] Xử lý trường hợp thiếu dữ liệu mà không tạo Progress Value giả.
- [ ] Không tự động thay đổi Goal status.
- [ ] Không tự động thay đổi Action status.
- [ ] Không tự sửa Measurement Values.
- [ ] UI không tự tính authoritative progress.
- [ ] Các module khác không triển khai trùng lặp Progress Calculation.
- [ ] User không thể truy cập Progress Data của User khác.
- [ ] Các lỗi được trả về theo shared error handling.

---

#### 15. Testing Requirements

**Unit Tests**

- Measurement Progress calculation.
- Measurement Target comparison.
- Action Completion calculation.
- Goal Progress calculation.
- Child Goal aggregation.
- Progress Summary generation.
- Missing Measurement Value handling.
- Missing Target handling.
- Invalid Unit handling.
- Unsupported Measurement type handling.
- Missing Action data handling.
- Invalid Goal hierarchy handling.
- Calculation Rule validation.

**Integration Tests**

- Retrieve Measurement data from B06.
- Retrieve Action data from B05.
- Retrieve Goal hierarchy from B03.
- Calculate Measurement Progress.
- Calculate Action Completion.
- Calculate Goal Progress.
- Aggregate Child Goal Progress.
- Retrieve Goal Progress Summary.
- Retrieve Progress Summary.
- Provide Progress Data to B09.
- Progress data consistency across repeated requests.

**Security Tests**

- Unauthenticated Progress request.
- Access another User's Goal Progress.
- Access another User's Measurement Progress.
- Access another User's Action Completion.
- Forge Goal ID from Frontend.
- Retrieve Progress using invalid ownership relationships.

**Data Integrity Tests**

- Measurement without Target.
- Measurement with invalid Value Type.
- Measurement with incompatible Unit.
- Goal without Measurement.
- Goal without Actions.
- Goal without Child Goals.
- Goal with invalid Child Goal relationship.
- Goal hierarchy containing cycles.
- Archived or cancelled Actions according to approved rules.
- Incomplete or missing source data.

**End-to-End Tests**

1. Create Goal → Create Measurement → Record Value → Calculate Measurement Progress.
2. Create Goal → Create Actions → Complete Actions → Calculate Action Completion.
3. Create Goal with Child Goals → Calculate Child Progress → Aggregate Parent Goal Progress.
4. Update Measurement Value → Recalculate Progress → Verify result reflects updated data.
5. Retrieve Goal Progress → Display in Progress Interface.
6. Retrieve Progress Data → Generate Review Summary through B09.
7. User A → Attempt to access User B's Progress Data → Rejected.

---

#### 16. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Finalize Progress Domain Rules | C08 |
| 2 | Approve Measurement Progress calculation rules | C06, C08 |
| 3 | Approve Action Completion calculation rules | C05, C08 |
| 4 | Approve Goal Progress calculation rules | C03, C08 |
| 5 | Approve Child Goal aggregation rules | C03, C08 |
| 6 | Define shared Progress contracts | D03 |
| 7 | Implement source data retrieval | B03, B05, B06 |
| 8 | Implement Measurement Progress calculation | C06, C08 |
| 9 | Implement Action Completion calculation | C05, C08 |
| 10 | Implement Goal Progress calculation | C03, C08 |
| 11 | Implement Child Goal aggregation | C03, C08 |
| 12 | Implement Progress Summary operations | Approved calculation rules |
| 13 | Integrate with Progress Interface | A09 |
| 14 | Integrate with Review Management | B09 |
| 15 | Run integration and security tests | Required dependencies |

Triển khai theo từng bước nhỏ.

Không triển khai công thức Progress trước khi các quy tắc tương ứng được phê duyệt.

Ưu tiên xây dựng calculation functions độc lập và có thể kiểm thử, tránh tạo nhiều phiên bản công thức ở các module khác nhau.

---

#### 17. Future Scope

Các chức năng sau không thuộc MVP hiện tại:

- Advanced Progress Analytics.
- Predictive Progress.
- Goal Completion Forecasting.
- AI Progress Diagnosis.
- Automatic Goal Adjustment.
- Automatic Action Prioritization.
- Advanced Performance Scoring.
- Historical Trend Analysis.
- Custom Progress Formula Builder.
- Advanced Progress Visualization.
- Cross-Project Progress Analytics.
- Advanced Productivity Metrics.

Chỉ xem xét triển khai khi sản phẩm có nhu cầu thực tế.

---

#### 18. Decisions and Implementation Baseline

| Item | Status | Decision |
|---|---|---|
| Progress Engine Ownership | APPROVED BY BLUEPRINT | B08 owns authoritative progress calculations |
| Measurement Progress | APPROVED CONCEPT | Calculate where applicable |
| Action Completion | APPROVED CONCEPT | Calculate from Action data |
| Goal Progress | APPROVED CONCEPT | Calculate according to approved rules |
| Child Goal Aggregation | APPROVED CONCEPT | Aggregate where applicable |
| Progress Summary | APPROVED SCOPE | Provide progress summaries |
| Measurement Target Comparison | APPROVED SCOPE | Compare actual values with targets |
| Measurement Formula | OPEN — C08 | To be approved |
| Measurement Baseline | OPEN — C06/C08 | To be defined |
| Action Completion Formula | OPEN — C08 | To be approved |
| Eligible Action Rules | OPEN — C05/C08 | To be defined |
| Goal Progress Formula | OPEN — C08 | To be approved |
| Progress Source Combination | OPEN — C08 | To be defined |
| Child Goal Aggregation | OPEN — C08 | To be approved |
| Child Goal Weighting | OPEN — C08 | To be defined |
| Missing Data Handling | OPEN — C08 | To be defined |
| Archived/Cancelled Action Handling | OPEN — C05/C08 | To be coordinated |
| Goal Completion Automation | NOT INCLUDED | B08 does not automatically change Goal status |
| Progress History | OPEN — C08/C09 | Persistence and snapshot strategy to be defined |
| Project Progress | OPEN — C02/C08 | Not assumed in MVP |
| Database Technology | OPEN — D01 | Defined in D01 |

**Outstanding Product Owner Decisions:**

| ID | Decision | Question |
|---|---|---|
| PROGRESS-001 | Measurement Progress Formula | How should progress be calculated for different Measurement types? |
| PROGRESS-002 | Measurement Baseline | Is a Baseline Value required for progress calculation? |
| PROGRESS-003 | Target Direction | How should increasing, decreasing and range-based targets be handled? |
| PROGRESS-004 | Action Completion Formula | Is Action Completion based on completed/total Actions? |
| PROGRESS-005 | Action Eligibility | Which Action statuses are included in completion calculations? |
| PROGRESS-006 | Goal Progress Formula | How should Measurement, Action and Child Goal progress contribute to Goal Progress? |
| PROGRESS-007 | Progress Weighting | Do different progress sources or Child Goals have different weights? |
| PROGRESS-008 | Missing Data | What should happen when a Goal has no Measurement, Actions or Child Goals? |
| PROGRESS-009 | Child Goal Aggregation | How should Parent Goal progress be calculated from Child Goals? |
| PROGRESS-010 | Archived/Cancelled Actions | Should archived or cancelled Actions be excluded from Action Completion? |
| PROGRESS-011 | Goal Completion | Does reaching 100% Progress automatically complete a Goal, or must the User complete it manually? |
| PROGRESS-012 | Progress History | Should progress results be stored as historical snapshots or recalculated from source data? |
| PROGRESS-013 | Project Progress | Is Project-level progress calculation included in MVP? |

Các quyết định trên phải được Product Owner phê duyệt trước khi triển khai các công thức liên quan.

---

#### 19. Ready-to-Code Status

**Specification Status:** READY TO CODE — CORE / PARTIALLY BLOCKED

**Development Status:** PARTIALLY AVAILABLE.

**Implementation Status:** NOT_STARTED.

**Available Core Work:**

- Define Progress calculation contracts.
- Implement source data retrieval interfaces.
- Implement calculation result structures.
- Implement calculation validation.
- Implement independent calculation functions after rules are approved.
- Implement Progress Summary response structures.
- Integrate Progress results with A09.

**Remaining Dependencies:**

- C03: Provide Goal hierarchy rules.
- C05: Provide Action rules and status definitions.
- C06: Provide Measurement rules.
- C08: Approve Progress calculation and aggregation rules.
- D01: Provide required persistence if Progress History is approved.
- D03: Provide shared Progress types.
- D04: Provide validation mechanisms.
- D06: Provide shared error handling.
- B01: Provide Current User Context.
- B03: Provide Goal data and hierarchy.
- B05: Provide Action status and execution data.
- B06: Provide Measurement Definitions and Records.
- B09: Integrate Progress data into Review.
- A09: Display Progress and Review information.

**Final Implementation Rule:**

B08 is the only authoritative Progress Calculation module in FLOW-UP.

B08 calculates Measurement Progress, Action Completion, Goal Progress, and Child Goal Aggregation where applicable.

B08 must use validated data from B03, B05 and B06, and must follow explicitly approved rules in C08.

Do not implement unapproved formulas. Do not automatically change Goal or Action status. Do not let Frontend or other application modules independently calculate authoritative progress.

The MVP implementation should prioritize calculation correctness, consistent results, clear handling of missing data, and a single authoritative source for all progress information.

Calculation rules must be explicitly approved before implementation. UI components must not independently calculate authoritative progress.

# B09. Review Management

**Architecture Status:** PROPOSED — MVP SCOPE  
**Specification Status:** DETAILED DESIGN — PARTIALLY BLOCKED  
**Development Status:** BLOCKED — REQUIRED CONTRACTS NOT YET APPROVED  
**Implementation Status:** NOT_STARTED  
**Priority:** MVP — REQUIRED

---

## 1. Purpose

B09 chịu trách nhiệm cung cấp chức năng Review để người dùng đánh giá kết quả thực hiện Goal dựa trên dữ liệu kế hoạch, dữ liệu thực thi và tiến độ đã được hệ thống ghi nhận.

Mục tiêu là giúp người dùng hiểu:

- Những gì đã được lên kế hoạch.
- Những gì thực tế đã được thực hiện.
- Kết quả thực tế khác với kế hoạch như thế nào.
- Tiến độ đã thay đổi ra sao.
- Những ghi chú hoặc nhận xét mà người dùng muốn lưu lại.

B09 là module tổng hợp và trình bày dữ liệu phục vụ Review. Module không sở hữu dữ liệu kế hoạch, dữ liệu thực thi, Measurement hoặc Progress.

B09 chỉ triển khai Review cơ bản trong MVP. Không xây dựng hệ thống coaching, tự động chẩn đoán nguyên nhân hoặc tự động điều chỉnh kế hoạch.

## 2. MVP Scope

**Included:**

- Retrieve plan data from B07.
- Retrieve Action execution data from B05.
- Retrieve progress data and history from B08.
- Retrieve relevant Measurement data/history through the appropriate module contract.
- Compare planned and actual execution.
- Generate a basic Review Summary from recorded data.
- Retrieve Review information.
- Create and update optional user review notes.
- Enforce user ownership and access rules.
- Handle missing or incomplete source data.

**Excluded:**

- AI-generated coaching or recommendations.
- Automated diagnosis of why a Goal is delayed or unsuccessful.
- Automatic modification of Goals, Actions, Measurements, or Schedules.
- Automatic rescheduling.
- Automatic changes to Goal or Action status.
- Advanced analytics and forecasting.
- Team review and collaboration.
- Public sharing of Reviews.
- Complex review templates and customizable scoring systems.

Các chức năng ngoài phạm vi MVP chỉ được xem xét khi có quyết định riêng.

## 3. Review Model

### 3.1. Review Concept

Review là một bản đánh giá được tạo từ dữ liệu đã ghi nhận trong một phạm vi đánh giá nhất định.

Review có thể tổng hợp:

- Planned work.
- Actual execution.
- Progress information.
- Measurement results.
- Optional user notes.

Review Summary là phần tổng hợp dữ liệu phục vụ người dùng. Nó không thay thế dữ liệu gốc từ các module khác.

### 3.2. Review Scope

Phạm vi Review có thể liên quan đến:

- A Goal.
- A time period.
- A set of planned and executed Actions.

Tuy nhiên, việc một Review bắt buộc phải gắn với Goal, gắn với Daily Plan hay chỉ cần một khoảng thời gian vẫn là quyết định OPEN.

Không tự giả định rằng MVP chỉ hỗ trợ một loại Review duy nhất trước khi chốt phạm vi nghiệp vụ.

### 3.3. Proposed Logical Data Model

**Review**

| Field | Description | Status |
|---|---|---|
| `id` | Review ID | PROPOSED |
| `user_id` | Owner's Internal User ID | REQUIRED |
| `goal_id` | Related Goal ID, if applicable | OPEN |
| `period_start` | Beginning of review period | OPEN |
| `period_end` | End of review period | OPEN |
| `summary` | Generated summary based on recorded data | PROPOSED |
| `created_at` | Creation timestamp | PROPOSED |
| `updated_at` | Last update timestamp | PROPOSED |

**Review Note**

| Field | Description | Status |
|---|---|---|
| `id` | Note ID | OPEN |
| `review_id` | Related Review ID | OPEN |
| `content` | User-written review note | PROPOSED |
| `created_at` | Creation timestamp | PROPOSED |
| `updated_at` | Last update timestamp | PROPOSED |

Đây là logical model đề xuất để thảo luận, không phải database schema đã được phê duyệt.

Cần quyết định liệu Review Note là một trường trực tiếp trong Review hay là một entity riêng. MVP không nên xây dựng một hệ thống ghi chú phức tạp nếu chỉ cần một nội dung nhận xét.

### 3.4. Review Data vs Source Data

B09 phải phân biệt rõ:

- Source Data: dữ liệu được quản lý bởi B05, B07, B08 và B06.
- Review Summary: kết quả tổng hợp từ source data.
- User Review Notes: nội dung do người dùng tự nhập.

B09 không được tạo bản sao có thể chỉnh sửa của dữ liệu nguồn để thay thế dữ liệu gốc.

Việc có lưu snapshot dữ liệu tại thời điểm Review hay không vẫn là OPEN.

## 4. Review Lifecycle

Review lifecycle cần được xác định trước khi triển khai persistence.

Các trạng thái có thể xem xét:

| Status | Meaning | Status of decision |
|---|---|---|
| `DRAFT` | Review đang được tạo hoặc chỉnh sửa | PROPOSED |
| `COMPLETED` | Người dùng đã hoàn thành Review | PROPOSED |
| `ARCHIVED` | Review được lưu trữ | OPEN |

Không coi các trạng thái trên là trạng thái đã được phê duyệt.

Các câu hỏi cần giải quyết:

- Review có cần trạng thái hay không?
- Review có thể được cập nhật sau khi hoàn thành không?
- Review có thể được tạo lại cho cùng một phạm vi thời gian không?
- Review có cần archive/delete không?
- Khi dữ liệu nguồn thay đổi, Review Summary cũ có được tính lại không?

## 5. Core Functions

### B09.1. Retrieve Review Data

**Purpose:** Lấy dữ liệu cần thiết để hiển thị Review.

**Inputs:**
- Authenticated User Context.
- Review scope hoặc Goal ID.
- Optional date range.

**Processing:**
1. Resolve authenticated user.
2. Validate quyền truy cập vào Goal hoặc phạm vi dữ liệu được yêu cầu.
3. Retrieve relevant plan data from B07.
4. Retrieve execution data from B05.
5. Retrieve progress data from B08.
6. Retrieve relevant Measurement data where required.
7. Normalize the returned data into a Review data response.
8. Return the result to the caller.

**Expected Results:**
- Review data retrieved successfully.
- No matching data.
- Partial source data available.
- Invalid review scope.
- Access denied.
- Required dependency unavailable.

**Rules:**
- B09 chỉ đọc dữ liệu nguồn.
- Không thay đổi dữ liệu của B05, B06, B07 hoặc B08.
- Không tự suy diễn dữ liệu bị thiếu thành dữ liệu đã hoàn thành.
- Phải phân biệt rõ dữ liệu không tồn tại và dữ liệu chưa được ghi nhận.

### B09.2. Compare Planned and Actual Results

**Purpose:** Đối chiếu kế hoạch với kết quả thực tế.

**Inputs:**
- Plan and Schedule data.
- Action execution data.
- Optional date range or Goal scope.

**Processing:**
1. Retrieve planned Actions and Schedule information from B07.
2. Retrieve actual execution information from B05.
3. Match planned work with relevant execution records using approved relationships.
4. Identify completed, incomplete, and unrecorded execution where the source data supports those distinctions.
5. Compare planned and actual information.
6. Return a structured comparison result.

**Expected Results:**
- Comparison completed.
- No planned data available.
- No execution data available.
- Partial comparison available.
- Invalid or unsupported relationship.
- Dependency unavailable.

**Rules:**
- Planned time must not be treated as actual execution time.
- A Schedule entry does not prove that an Action was executed.
- An Action marked completed does not automatically prove that it followed its original schedule.
- Do not infer that an Action was skipped solely because execution data is missing.
- Matching rules must respect the approved Action and Schedule relationships.
- B09 does not change Action status or Schedule data.

Exact comparison rules depend on the approved Action execution and Schedule contracts.

### B09.3. Retrieve Progress History

**Purpose:** Lấy lịch sử tiến độ phục vụ Review.

**Inputs:**
- Authenticated User Context.
- Goal ID.
- Optional date range.

**Processing:**
1. Validate Goal ownership.
2. Request progress history from B08.
3. Retrieve available progress records.
4. Preserve source timestamps and relevant context.
5. Return the history in a consistent response structure.

**Expected Results:**
- Progress history retrieved.
- No progress history available.
- Partial history available.
- Goal not found.
- Access denied.
- Progress dependency unavailable.

**Rules:**
- B08 is the authoritative owner of Progress calculations and history.
- B09 must not independently calculate historical progress.
- B09 must not fabricate historical values from current progress.
- If B08 does not provide historical snapshots or records, B09 must report that history is unavailable rather than inventing it.

### B09.4. Generate Review Summary

**Purpose:** Tạo bản tổng hợp Review cơ bản từ dữ liệu đã ghi nhận.

**Inputs:**
- Plan data.
- Execution data.
- Progress information.
- Measurement data where available.

**Processing:**
1. Retrieve the required source data.
2. Validate source availability and consistency.
3. Identify the available planned and actual information.
4. Summarize the comparison results.
5. Include available progress and Measurement information.
6. Identify missing information where relevant.
7. Return a concise Review Summary.

**Expected Summary Content:**
- Review scope.
- Planned work overview.
- Actual execution overview.
- Planned versus actual comparison.
- Available progress information.
- Available Measurement results.
- Data limitations or missing records.

**Rules:**
- Summary must be based on recorded system data.
- Do not invent causes, explanations, or user intentions.
- Do not make unsupported judgments about user performance.
- Do not generate AI coaching in the basic MVP Review.
- Do not modify source data.
- Do not claim that an Action was not performed when execution data is simply unavailable.
- Summary must distinguish recorded facts from missing information.

The exact summary fields and comparison metrics remain dependent on approved domain rules.

### B09.5. Create Review Notes

**Purpose:** Lưu nhận xét do người dùng nhập trong quá trình Review.

**Inputs:**
- Authenticated User Context.
- Review ID or approved Review scope.
- Note content.

**Processing:**
1. Validate authenticated user.
2. Validate Review ownership or the approved target scope.
3. Validate note content.
4. Create or update the user note.
5. Persist the note.
6. Return the saved result.

**Rules:**
- Review Notes are optional.
- User notes must remain separate from generated Review Summary.
- Saving a note must not modify Goal, Action, Measurement, Schedule, or Progress data.
- Empty notes should not create meaningless records.
- Note length limits must be defined in the shared validation contract.

### B09.6. Retrieve Review

**Purpose:** Lấy Review đã được lưu.

**Inputs:**
- Authenticated User Context.
- Review ID.

**Processing:**
1. Validate authenticated user.
2. Retrieve Review by ID.
3. Validate ownership.
4. Retrieve associated user notes if applicable.
5. Return Review data.

**Expected Results:**
- Review retrieved.
- Review not found.
- Access denied.
- Persistence error.

### B09.7. Update Review Notes

**Purpose:** Cập nhật nội dung ghi chú của người dùng.

**Inputs:**
- Authenticated User Context.
- Review ID.
- Updated note content.

**Rules:**
- Only the owner can update the note.
- Updating notes must not silently regenerate or overwrite the user's content.
- Whether notes can be edited after Review completion depends on the approved Review lifecycle.

### B09.8. Generate or Refresh Review Summary

**Purpose:** Tạo mới hoặc cập nhật Review Summary from the latest available source data.

**Rules:**
- Summary generation must be deterministic with respect to the same source data and approved rules, unless a later approved design introduces another method.
- Refreshing a summary must not overwrite user notes.
- The system must make clear whether the summary reflects current source data or a historical snapshot.
- Snapshot persistence and refresh behavior remain OPEN.

## 6. Relationships and Data Ownership

| Module | Owns | B09 interaction |
|---|---|---|
| B01 Authentication & User Context | Authenticated User Context | Uses Internal User ID |
| B03 Goal Management | Goal and hierarchy | Validates and retrieves Goal context |
| B05 Action Management | Action and execution data | Reads actual execution |
| B06 Measurement Management | Measurement definitions and records | Reads Measurement values/history where needed |
| B07 Planning & Scheduling | Daily Plan and Schedule | Reads planned work |
| B08 Progress Engine | Progress calculation and progress data | Reads progress summaries/history |
| B09 Review Management | Review and optional user notes | Owns Review-specific data |
| B10 AI Orchestration | AI proposal workflows | No direct MVP dependency for basic Review |

**Ownership Rules:**

- B09 owns Review-specific records and user review notes.
- B05 remains the authoritative owner of Action execution data.
- B07 remains the authoritative owner of planned work and Schedule.
- B06 remains the authoritative owner of Measurement definitions and records.
- B08 remains the authoritative owner of Progress calculations and progress history.
- B03 remains the authoritative owner of Goal data.
- B09 must not write directly into another module's owned data.

B09 may coordinate multiple read operations, but it must not bypass the owning module's application/domain contract.

## 7. Review Comparison Rules

### 7.1. Planned vs Actual

The comparison should distinguish at least the following concepts where source data supports them:

| Concept | Meaning |
|---|---|
| Planned | Work represented in the approved plan or Schedule |
| Actual | Execution information recorded by B05 |
| Completed | Action completion recorded by B05 |
| Incomplete | Action not recorded as completed, subject to approved status rules |
| Unrecorded | No sufficient execution information exists |
| Variance | Difference between planned and actual information |

Do not treat `Incomplete` and `Unrecorded` as equivalent.

### 7.2. Time Comparison

Potential comparison fields include:

- Planned start time.
- Planned end time.
- Actual start time.
- Actual completion time.
- Actual duration.

However, the exact meaning and availability of these fields depend on B05 and B07 contracts.

B09 must not invent actual duration from planned duration.

### 7.3. Progress Comparison

B09 retrieves progress information from B08.

Possible information includes:

- Current Goal Progress.
- Previous Progress.
- Progress change over the selected period.
- Measurement progress where supported.

B09 does not define the progress formula, weighting, or aggregation method.

Those rules belong to B08 and remain subject to DEC-018.

### 7.4. Missing Data

When source data is unavailable:

- Return the available portions of the Review.
- Identify unavailable sections.
- Do not treat missing data as zero.
- Do not generate unsupported conclusions.
- Do not fail the entire Review if an optional data source is unavailable and the remaining data is sufficient.

The exact dependency-failure policy must be specified for each operation.

## 8. Application Operations

Logical application operations:

| Operation | Purpose |
|---|---|
| `getReviewData(scope)` | Retrieve data required for Review |
| `comparePlannedAndActual(scope)` | Compare planned and actual execution |
| `getProgressHistory(goalId, range)` | Retrieve progress history |
| `generateReviewSummary(scope)` | Generate basic Review Summary |
| `createReview(scope, note?)` | Create a Review where supported by the approved model |
| `getReview(reviewId)` | Retrieve a saved Review |
| `updateReviewNote(reviewId, content)` | Create or update user notes |
| `refreshReviewSummary(reviewId)` | Refresh summary from source data |

These are logical operations, not final HTTP endpoints.

Request/response schemas, pagination, transaction boundaries, and API conventions must follow D03 and D05.

## 9. User Flow

### 9.1. Basic Review Flow

1. User opens Progress & Review Interface.
2. User selects a Goal or supported Review scope.
3. Frontend requests Review data from B09.
4. B09 validates the authenticated user and scope.
5. B09 retrieves plan data from B07.
6. B09 retrieves execution data from B05.
7. B09 retrieves progress information from B08.
8. B09 retrieves relevant Measurement data where required.
9. B09 compares the available planned and actual data.
10. B09 generates a basic Review Summary.
11. Frontend displays the result.
12. User optionally enters review notes.
13. Frontend submits the notes to B09.
14. B09 validates and persists the notes.

### 9.2. Partial Data Flow

If one source is unavailable or has no data:

1. B09 records which data is available.
2. B09 avoids inventing missing information.
3. B09 returns the supported portions of the Review.
4. Frontend displays the available result and relevant limitations.
5. User can still review and save notes where the Review scope allows it.

## 10. Error Handling

| Error Code | Meaning |
|---|---|
| `REVIEW_NOT_FOUND` | Review does not exist |
| `REVIEW_ACCESS_DENIED` | User cannot access this Review |
| `REVIEW_INVALID_SCOPE` | Review scope is invalid |
| `REVIEW_INVALID_DATE_RANGE` | Invalid review period |
| `REVIEW_GOAL_NOT_FOUND` | Related Goal does not exist |
| `REVIEW_SOURCE_DATA_UNAVAILABLE` | Required source data cannot be retrieved |
| `REVIEW_PARTIAL_DATA` | Only partial source data is available |
| `REVIEW_COMPARISON_FAILED` | Planned and actual comparison failed |
| `REVIEW_PROGRESS_HISTORY_UNAVAILABLE` | Progress history is unavailable |
| `REVIEW_SUMMARY_GENERATION_FAILED` | Review Summary generation failed |
| `REVIEW_NOTE_INVALID` | Note content is invalid |
| `REVIEW_NOTE_EMPTY` | Note content is empty where content is required |
| `REVIEW_INVALID_STATE` | Operation is invalid for the current Review state |
| `REVIEW_PERSISTENCE_ERROR` | Failed to persist Review data |
| `REVIEW_DEPENDENCY_UNAVAILABLE` | Required module dependency is unavailable |

Error codes are proposed and must follow D06's shared error conventions.

**Error Rules:**

- Do not expose internal database or module errors directly to the frontend.
- Distinguish missing source data from dependency failure.
- Use structured errors from D06.
- Log operational failures without unnecessarily recording private user notes.
- Preserve partial results when the operation contract permits them.

## 11. Dependencies

| Dependency | Purpose |
|---|---|
| B01 Authentication & User Context | Resolve authenticated user |
| B03 Goal Management | Validate and retrieve Goal context |
| B05 Action Management | Retrieve Action execution data |
| B06 Measurement Management | Retrieve Measurement data and history |
| B07 Planning & Scheduling | Retrieve Daily Plan and Schedule |
| B08 Progress Engine | Retrieve progress summaries and history |
| C01 Identity & Ownership Rules | Ownership and access rules |
| C03 Goal & Hierarchy Rules | Goal scope and relationship rules |
| C05 Action Rules | Action and execution semantics |
| C06 Measurement Rules | Measurement semantics |
| C07 Planning & Schedule Rules | Planned work semantics |
| C08 Progress Rules | Progress data semantics |
| C09 Review Rules | Review domain invariants |
| D01 Database & Persistence | Persist Review-specific data |
| D03 Shared Types & Contracts | Shared Review contracts |
| D04 Validation | Validate input and domain data |
| D05 API / Application Communication | Module communication contracts |
| D06 Error Handling | Standardized error handling |
| D07 Logging & Observability | Operational logging |
| D08 Security & Configuration | Data access protection |
| A09 Progress & Review Interface | Display Review and collect notes |

**Integration Rules:**

- B09 uses B01-provided Internal User Context.
- B09 retrieves planned data through B07.
- B09 retrieves actual execution data through B05.
- B09 retrieves authoritative progress data through B08.
- B09 retrieves Measurement data through B06 when needed.
- B09 does not directly query another module's private persistence tables as a substitute for an agreed contract.
- B09 does not depend on B10 for basic MVP Review.

## 12. Security Requirements

- Every Review operation requires an authenticated user.
- Resolve ownership from the authenticated User Context.
- Never trust a client-provided `user_id` as proof of ownership.
- Validate access to the related Goal and source data.
- Ensure a user cannot retrieve another user's Review or notes.
- Apply ownership checks to both Review records and their related data.
- Do not expose private notes through unrelated public or shared interfaces.
- Avoid logging full user notes or unnecessary personal content.
- Follow D08 security and configuration rules.
- Database-level protection must be consistent with the selected persistence and authorization architecture.

## 13. Acceptance Criteria

B09 is acceptable for MVP when the following conditions are met.

**Review Data Retrieval**
- The system retrieves planned data from B07.
- The system retrieves actual execution data from B05.
- The system retrieves progress data from B08.
- The system retrieves relevant Measurement information where required.
- The system validates the user's access to the requested scope.
- Missing data is not fabricated.

**Planned vs Actual Comparison**
- The system compares planned work with recorded execution.
- Planned time is not treated as actual time.
- Missing execution records are not automatically classified as failed work.
- Comparison follows approved Action and Schedule relationships.
- Partial data is represented accurately.

**Progress History**
- The system retrieves progress history from B08.
- B09 does not independently calculate authoritative progress.
- Missing historical records are reported as unavailable.
- Current progress is not presented as historical progress.

**Review Summary**
- The system generates a concise summary from recorded data.
- The summary distinguishes recorded facts from unavailable information.
- The summary does not invent causes or unsupported conclusions.
- The summary does not modify source data.

**Review Notes**
- The user can optionally create and update notes.
- Notes are associated with the correct Review or approved scope.
- Notes are separate from generated summaries.
- A user cannot access or modify another user's notes.

**Security and Reliability**
- Unauthenticated requests are rejected.
- Cross-user access is rejected.
- Dependency errors are handled through the shared error contract.
- Persistence errors are handled safely.
- Review functionality does not break the underlying Goal, Action, Planning, Measurement, or Progress workflows.

## 14. Testing Requirements

**Unit Tests**
- Review scope validation.
- Planned and actual comparison logic.
- Missing data handling.
- Review Summary generation.
- Review note validation.
- Review ownership validation.
- Review lifecycle rules once approved.

**Integration Tests**
- Retrieve planned data from B07.
- Retrieve execution data from B05.
- Retrieve progress history from B08.
- Retrieve Measurement information from B06.
- Generate Review Summary from multiple sources.
- Persist Review and notes.
- Retrieve saved Review.
- Update user notes.
- Handle unavailable dependencies.

**Security Tests**
- Unauthenticated Review request.
- Forged client-provided User ID.
- Cross-user Review retrieval.
- Cross-user note update.
- Access to a Review associated with another user's Goal.
- Unauthorized access through nested source relationships.

**End-to-End Tests**
1. Create Goal → Create Actions → Plan Actions → Record execution → Open Review.
2. Open Review → Compare planned and actual → View progress information.
3. Open Review → Add optional notes → Save → Reload → Verify notes.
4. Open Review with missing execution records → Verify that missing information is not treated as zero or completed.
5. User A → Attempt to retrieve User B's Review → Rejected.

## 15. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Approve Review scope and lifecycle | Product Owner / C09 |
| 2 | Confirm Action execution read contract | B05 |
| 3 | Confirm Daily Plan and Schedule read contract | B07 |
| 4 | Confirm Progress history read contract | B08 |
| 5 | Confirm Measurement read contract | B06 |
| 6 | Define Review domain model | C09 / D03 |
| 7 | Define Review persistence requirements | D01 |
| 8 | Define Review data retrieval operation | B09 / D05 |
| 9 | Implement planned vs actual comparison | B05 / B07 |
| 10 | Implement progress history retrieval | B08 |
| 11 | Implement basic Review Summary | B09 |
| 12 | Implement optional Review Notes | B09 / D01 |
| 13 | Integrate A09 Progress & Review Interface | A09 |
| 14 | Run integration and security tests | Required dependencies |

Do not begin implementation of blocked functions before the relevant contracts and business rules are approved.

## 16. Future Scope

The following capabilities are not included in the current MVP:

- AI-generated coaching and personalized recommendations.
- Automated diagnosis of execution problems.
- Automatic plan adjustment.
- Automatic rescheduling of incomplete Actions.
- Long-term behavioral analytics.
- Predictive progress analysis.
- Advanced review templates.
- Weekly/monthly review automation.
- Review sharing and collaboration.
- Team and manager review workflows.
- Advanced historical snapshots and audit analytics.

Only consider these capabilities when the MVP has demonstrated a real need.

## 17. Decisions and Implementation Baseline

| Item | Status | Notes |
|---|---|---|
| Basic Review in MVP | APPROVED — Blueprint MVP scope | Basic review workflow is required |
| Review compares planned and actual work | APPROVED — Product Model | Core Review responsibility |
| Review uses recorded data | APPROVED — Product Principles | Evidence-led Review |
| B09 owns Review-specific data | PROPOSED | Requires detailed domain approval |
| Review scope: Goal / period / Daily Plan | OPEN | Scope and association model |
| Review lifecycle and status | OPEN | May not need a complex lifecycle |
| Review persistence | OPEN | Whether to persist Review records |
| Review Note model | OPEN | Embedded field or separate entity |
| Review Summary persistence | OPEN | Live generation or saved snapshot |
| Summary refresh behavior | OPEN | Recompute or preserve historical result |
| Progress history contract | DEPENDENCY OPEN | B08 must define supported history |
| Planned vs actual matching rules | DEPENDENCY OPEN | Depends on B05 and B07 contracts |
| Partial data behavior | PROPOSED | Return supported portions and identify missing data |
| AI coaching in Review | FUTURE SCOPE | Not part of basic MVP |
| Automatic plan adjustment | FUTURE SCOPE | Not part of basic MVP |

**Open Product Owner Decisions:**

- REVIEW-001: What is the primary Review scope: Goal, time period, Daily Plan, or a combination?
- REVIEW-002: Is a Review a persisted entity, or is it generated on demand with only user notes persisted?
- REVIEW-003: Should a Review have lifecycle states, or should it remain editable without a formal status?
- REVIEW-004: Should user notes be stored directly in Review or as a separate Review Note entity?
- REVIEW-005: Should Review Summary be regenerated from current source data or preserve a snapshot from the time of review?
- REVIEW-006: Can a user create multiple Reviews for the same Goal and period?
- REVIEW-007: What is the required behavior when one or more source modules cannot provide data?

These decisions must be explicitly approved before they become permanent domain rules.

## 18. Ready-to-Code Status

**Specification Status:** DETAILED DESIGN — PARTIALLY BLOCKED

**Development Status:** BLOCKED — REQUIRED CONTRACTS NOT YET APPROVED

**Implementation Status:** NOT_STARTED

**Ready Core:**
- B09 responsibility and module boundary.
- Basic Review workflow.
- Read-only integration principle for source data.
- Separation of generated summary and user notes.
- Basic security and ownership requirements.
- Basic missing-data handling principles.

**Blocking Items:**
- Review scope and persistence model.
- Review lifecycle, if required.
- Review Note storage model.
- Review Summary snapshot and refresh behavior.
- B05 Action execution read contract.
- B07 Planning and Schedule read contract.
- B08 Progress history read contract.
- B06 Measurement history read contract.
- Approved matching and comparison rules.

**Implementation Rule:**

B09 must remain a lightweight Review layer. It retrieves and organizes data from the authoritative modules, compares recorded plans with actual execution, presents a basic summary, and stores optional user notes.

Do not duplicate source data, calculate authoritative progress, introduce AI coaching, or automatically adjust the user's plan.
# B10. AI Orchestration

**Architecture Status:** PROPOSED — MVP SCOPE  
**Specification Status:** DETAILED DESIGN — PARTIALLY BLOCKED  
**Development Status:** BLOCKED — REQUIRED CONTRACTS NOT YET APPROVED  
**Implementation Status:** NOT_STARTED  
**Priority:** MVP — REQUIRED

---

## 1. Purpose

B10 chịu trách nhiệm điều phối các quy trình AI trong FLOW-UP, kết nối dữ liệu nghiệp vụ đã được người dùng cho phép sử dụng với AI Provider, quản lý quá trình tương tác, xác thực kết quả và chuyển các đề xuất hợp lệ đến quy trình phê duyệt.

Mục tiêu là giúp người dùng:

- Làm rõ một Goal chưa cụ thể.
- Nhận phản hồi về tính khả thi của Goal.
- Nhận đề xuất phân rã Goal thành cấu trúc phù hợp.
- Nhận đề xuất Daily Plan.
- Xem xét, chỉnh sửa, chấp nhận hoặc từ chối các đề xuất AI.

B10 đóng vai trò Application Orchestration Layer cho AI.

B10 không sở hữu Goal, Milestone, Action, Measurement, Schedule hoặc Progress. Những dữ liệu này vẫn thuộc quyền quản lý của các module nghiệp vụ tương ứng.

**Core Principle:**

AI proposes. The user decides. Application and Domain validate. Business modules commit approved changes.

## 2. MVP Scope

**Included:**

- Build AI requests from relevant user-approved context.
- Goal clarification workflow.
- Goal feasibility feedback workflow.
- Goal Tree proposal workflow.
- Basic AI Daily Plan proposal workflow.
- AI provider integration through a controlled adapter.
- Structured AI output validation.
- Proposal creation and retrieval.
- Proposal editing and approval workflow support.
- Apply approved changes through normal application/domain operations.
- Handle provider errors, invalid output, timeouts, and usage limits.
- Protect user data and AI provider credentials.
- Distinguish AI proposal data from official domain data.

**Excluded:**

- Autonomous AI Agent that independently modifies user data.
- AI that executes Actions on behalf of the user.
- Automatic Goal or Action creation without approval.
- Automatic Schedule changes.
- Automatic plan adjustment based on user behavior.
- Advanced long-term memory and user profiling.
- Multi-agent orchestration.
- Custom model training or fine-tuning.
- Complex AI workflow builder.
- Multiple AI providers with automatic routing and fallback unless separately approved.
- Advanced AI analytics and evaluation infrastructure.

MVP chỉ cần các AI capabilities đã được xác định trong Master Blueprint.

## 3. Architecture and Module Boundaries

### 3.1. B10 Responsibility

B10 manages the application-level AI workflow:

1. Receive an AI operation request.
2. Resolve authenticated user context.
3. Retrieve relevant user-approved context.
4. Build a structured AI request.
5. Call the selected AI provider.
6. Receive and validate AI output.
7. Convert valid output into a proposal.
8. Return or persist the proposal.
9. Receive user approval.
10. Apply approved changes through normal business operations.

### 3.2. B10 vs E. AI Capability

B10 and E have different responsibilities.

| Component | Responsibility |
|---|---|
| B10 AI Orchestration | Coordinates AI workflows, context, provider calls, validation, proposals, and approval |
| E01 Goal Understanding & Clarification | Understands Goal descriptions and identifies missing context |
| E02 Goal Feasibility Feedback | Evaluates potential feasibility concerns and presents alternatives |
| E03 Goal Tree Proposal | Generates structured Goal breakdown proposals |
| E04 Proposal Review & Approval | Defines proposal review and approval capability |
| E05 Basic Daily Plan Proposal | Generates Daily Plan proposals |

E defines the AI capabilities. B10 coordinates their execution through the application.

The exact technical boundary between E and B10 must be reflected in the implementation architecture without duplicating business logic.

### 3.3. Authoritative Data Ownership

| Module | Owns | B10 interaction |
|---|---|---|
| B01 | Authentication and User Context | Resolves authenticated user |
| B02 | Workspace and Project | Retrieves relevant context where needed |
| B03 | Goal and hierarchy | Reads context; applies approved Goal changes |
| B04 | Milestone | Applies approved Milestone changes |
| B05 | Action and execution | Reads relevant context; applies approved Action changes |
| B06 | Measurement | Reads relevant context; applies approved Measurement changes |
| B07 | Daily Plan and Schedule | Applies approved Planning changes |
| B08 | Progress | Retrieves authoritative progress context |
| B09 | Review | Not required for core AI workflows unless a later capability needs it |
| B10 | AI orchestration and proposal workflow | Owns AI application workflow |

B10 must not directly bypass the owning module to modify its data.

## 4. AI Request Context

### 4.1. Context Sources

B10 builds requests using only relevant information that the user is authorized to access and that is appropriate for the requested AI operation.

Potential context sources:

| Source | Relevant Information |
|---|---|
| B02 | Workspace and Project context |
| B03 | Goal description, hierarchy, target date |
| B04 | Existing Milestones |
| B05 | Existing Actions and relevant execution information |
| B06 | Measurement definitions, targets, recorded values |
| B07 | Daily Plans and Schedule information |
| B08 | Current progress summaries |

Not every AI operation requires every source.

### 4.2. Context Rules

- Retrieve only information required for the requested capability.
- Do not automatically send the entire user's Workspace to the AI Provider.
- Do not trust user-provided identifiers as proof of data ownership.
- Validate ownership before retrieving private context.
- Do not include authentication tokens, passwords, provider secrets, or internal credentials.
- Do not treat unapproved AI proposals as official context.
- Clearly distinguish user-provided information, saved domain data, and derived progress information.
- Handle unavailable context without inventing missing values.

### 4.3. Context Assembly

Logical context structure:

**AI Request Context**

| Field | Description | Status |
|---|---|---|
| `user_id` | Authenticated Internal User ID | REQUIRED |
| `operation_type` | Requested AI capability | PROPOSED |
| `user_input` | Current user request or description | REQUIRED |
| `goal_context` | Relevant Goal information | OPTIONAL |
| `project_context` | Relevant Project information | OPTIONAL |
| `action_context` | Relevant Action information | OPTIONAL |
| `measurement_context` | Relevant Measurement information | OPTIONAL |
| `planning_context` | Relevant Planning information | OPTIONAL |
| `progress_context` | Relevant Progress information | OPTIONAL |
| `constraints` | User-approved constraints | OPTIONAL |

This is a logical request contract, not an approved API schema.

## 5. AI Provider Integration

### 5.1. Provider Boundary

B10 must call the selected AI Provider through a controlled integration boundary.

The application must not spread provider-specific SDK calls across individual business modules.

Provider-specific implementation belongs behind the AI integration boundary.

### 5.2. Provider Responsibilities

The integration must support:

- Sending structured AI requests.
- Receiving AI responses.
- Handling provider authentication.
- Handling request timeouts.
- Handling rate limits and usage limits.
- Handling provider availability errors.
- Normalizing provider-specific errors.
- Supporting structured output where available.

### 5.3. Provider Selection

The AI Provider and model are subject to DEC-021.

**Current status: OPEN.**

No provider, model, pricing tier, or fallback strategy is considered approved by this specification.

### 5.4. Provider Rules

- Provider credentials must remain server-side.
- Do not expose API keys to the frontend.
- Do not expose provider SDK objects to business modules.
- Do not assume provider output is valid merely because the provider returned a successful response.
- Provider failures must not corrupt official domain data.
- Do not silently switch providers unless an approved fallback policy exists.

## 6. AI Capabilities

### 6.1. E01 — Goal Understanding & Clarification

**Purpose:** Help the user clarify an incomplete or ambiguous Goal.

**Inputs:**
- Initial Goal description.
- Relevant existing Goal context, if applicable.
- User-provided constraints.
- Optional target timeframe.

**Processing:**
1. Receive the user's Goal description.
2. Build the relevant AI context.
3. Send the clarification request.
4. Identify missing or ambiguous information.
5. Generate clarification questions.
6. Return questions and relevant assumptions.

**Expected Results:**
- Goal understanding response.
- Clarification questions.
- Missing information identified.
- Insufficient context response.
- Provider error.

**Rules:**
- Questions should focus on information necessary to understand the desired outcome.
- Do not invent user intentions.
- Do not create official Goal data during clarification.
- User remains responsible for confirming the intended Goal.

### 6.2. E02 — Goal Feasibility Feedback

**Purpose:** Help the user evaluate potential problems with a requested Goal, timeframe, or workload.

**Inputs:**
- User's Goal description.
- Current state where available.
- Desired outcome.
- Target timeframe where provided.
- Relevant constraints.

**Processing:**
1. Retrieve relevant user-approved context.
2. Build a feasibility request.
3. Send the request to the AI Provider.
4. Validate the response.
5. Return feasibility feedback and assumptions.

**Expected Results:**
- Potential feasibility concerns.
- Explanations and assumptions.
- Suggested alternatives where useful.
- Insufficient information response.

**Rules:**
- AI may challenge the requested target, timeframe, or workload.
- AI must explain important assumptions and reasons.
- AI must avoid claiming certainty when information is insufficient.
- AI must leave the final decision to the user.
- Feedback must not automatically change the Goal.

### 6.3. E03 — Goal Tree Proposal

**Purpose:** Generate a structured proposal to break down a Goal into executable components.

**Potential Proposal Components:**
- Child Goals.
- Milestones.
- Actions.
- Measurements.

**Processing:**
1. Receive the confirmed Goal context.
2. Retrieve relevant existing data.
3. Build the AI request.
4. Request a structured Goal breakdown.
5. Receive the provider response.
6. Validate the structure and relationships.
7. Create a proposal.
8. Return the proposal for user review.

**Rules:**
- Proposal items are not official domain data.
- Avoid unnecessary decomposition.
- Do not create unsupported relationships.
- Respect existing Goal hierarchy constraints.
- Validate every proposed item against the corresponding domain contract.
- Do not automatically duplicate existing Goal, Milestone, Action, or Measurement records.

### 6.4. E04 — Proposal Review & Approval

**Purpose:** Allow users to inspect and decide which proposed changes become official application data.

**Supported User Decisions:**
- Accept the complete proposal.
- Accept selected items.
- Edit proposed items.
- Reject proposed items.

**Processing:**
1. Retrieve the proposal.
2. Validate proposal ownership and current status.
3. Receive user decisions.
4. Validate the selected and edited items.
5. Determine the approved changes.
6. Apply changes through normal application/domain operations.
7. Return the application result.

**Rules:**
- AI cannot approve its own proposal.
- Approval must be an explicit user action.
- Editing a proposal does not automatically approve it.
- Rejected items must not become official domain data.
- Only approved items can be applied.
- Every applied item must pass the owning module's validation.
- A proposal must not be treated as successfully applied until the relevant operations report success.
- Failed application must not be represented as a successful approval.

### 6.5. E05 — Basic Daily Plan Proposal

**Purpose:** Generate a proposed Daily Plan using relevant existing application context.

**Potential Inputs:**
- Goal information.
- Available Actions.
- Deadlines.
- Progress information.
- Estimated Action durations.
- User-provided time constraints.
- Existing Planning information where relevant.

**Processing:**
1. Receive the user's planning request.
2. Retrieve relevant Goal and Action context.
3. Retrieve available progress and scheduling context.
4. Build the AI request.
5. Generate a structured Daily Plan proposal.
6. Validate proposed Actions and scheduling information.
7. Return the proposal for user editing and approval.

**Rules:**
- The proposal must be editable.
- AI-proposed planning data is not an active Daily Plan.
- The user must explicitly approve the proposal.
- Approved changes must use B07's normal Planning operations.
- Manual Planning and AI-assisted Planning must share the same underlying Planning and Schedule model.
- Do not bypass B07 to create official Schedule records.
- Do not invent Action IDs or claim that nonexistent Actions are already available.

## 7. Proposal Model

### 7.1. Proposal Concept

A Proposal represents structured output generated by an AI workflow that has not yet become official domain data.

B10 owns the AI proposal workflow and its lifecycle.

Proposal data must remain separate from official Goal, Milestone, Action, Measurement, and Schedule records.

### 7.2. Proposed Logical Data Model

**AI Proposal**

| Field | Description | Status |
|---|---|---|
| `id` | Proposal ID | PROPOSED |
| `user_id` | Owner's Internal User ID | REQUIRED |
| `operation_type` | AI capability that generated the proposal | PROPOSED |
| `proposal_type` | Goal Tree or Daily Plan proposal | PROPOSED |
| `status` | Current proposal status | OPEN |
| `input_context` | Relevant request context or reference | OPEN |
| `proposal_data` | Structured AI output | REQUIRED |
| `created_at` | Creation timestamp | PROPOSED |
| `updated_at` | Last update timestamp | PROPOSED |
| `expires_at` | Optional expiration timestamp | OPEN |

The logical model does not imply that every context field or raw provider response must be persisted.

### 7.3. Proposal Status

Potential statuses:

| Status | Meaning | Decision |
|---|---|---|
| `PENDING_REVIEW` | Proposal is waiting for user review | PROPOSED |
| `EDITED` | User has modified proposal content | PROPOSED |
| `APPROVED` | User has approved the proposal | PROPOSED |
| `PARTIALLY_APPROVED` | User approved selected items | PROPOSED |
| `REJECTED` | User rejected the proposal | PROPOSED |
| `APPLIED` | Approved changes were successfully applied | PROPOSED |
| `FAILED` | Proposal application failed | PROPOSED |
| `EXPIRED` | Proposal is no longer valid | OPEN |

These statuses are proposals for discussion, not approved lifecycle rules.

### 7.4. Proposal Rules

- Every proposal must belong to an authenticated user.
- A user cannot retrieve another user's proposal.
- Proposal data must be validated before being displayed as a structured proposal.
- A proposal must not be applied twice unintentionally.
- An already applied proposal must not be applied again without an explicitly approved workflow.
- Rejected proposals cannot be applied.
- Changes to official data after proposal generation may invalidate some proposal assumptions.
- Before applying a proposal, validate affected entities and relationships again.
- Preserve the distinction between AI-generated content and user-edited content where required by the approved model.

## 8. Structured AI Output Validation

### 8.1. Validation Layers

AI output must pass multiple validation stages.

**Stage 1 — Provider Response Validation**
- Provider response exists.
- Response is not empty.
- Response is not truncated in a way that prevents reliable parsing.
- Provider returned an acceptable completion result.

**Stage 2 — Structural Validation**
- Output matches the expected response format.
- Required fields exist.
- Field types are valid.
- Unsupported fields are rejected or handled according to the approved contract.
- Identifiers and enumerations follow the schema.

**Stage 3 — Semantic Validation**
- Proposed content is meaningful for the requested operation.
- Required relationships are represented correctly.
- No unsupported entity references are introduced.
- The proposal matches the expected capability.

**Stage 4 — Domain Validation**
- Goal rules are validated by B03 and C03.
- Milestone rules are validated by B04 and C04.
- Action rules are validated by B05 and C05.
- Measurement rules are validated by B06 and C06.
- Planning rules are validated by B07 and C07.

**Stage 5 — Approval Validation**
- The proposal belongs to the authenticated user.
- The proposal is in an eligible state.
- The user explicitly approved the intended changes.
- Approved items have not become invalid due to intervening data changes.

### 8.2. Validation Rules

- Never trust raw AI output.
- Never treat syntactically valid JSON as automatically valid business data.
- Never write raw AI output directly into official domain tables.
- Do not silently discard invalid items and claim the entire proposal is valid.
- Return validation issues in a structured form.
- Allow the user to review and correct supported validation issues.
- Revalidate all affected data before applying approved changes.

### 8.3. AI Output and Prompt Safety

AI output and retrieved user content must be treated as untrusted input.

- Do not execute instructions embedded in retrieved domain content.
- Do not expose system prompts or provider credentials.
- Do not allow AI output to bypass authorization or domain validation.
- Do not allow AI-generated content to invoke arbitrary application operations.
- Only allow supported, predefined proposal types and operations.

## 9. Proposal Application Workflow

### 9.1. General Workflow

`AI Request → Context Assembly → Provider Call → Output Validation → Proposal → User Review → User Approval → Domain Validation → Normal Business Operations → Application Result`

### 9.2. Goal Tree Application

After approval:

- Goal changes go through B03.
- Milestone changes go through B04.
- Action changes go through B05.
- Measurement changes go through B06.

B10 coordinates the operations but does not become the owner of those entities.

### 9.3. Daily Plan Application

After approval:

- Planning changes go through B07.
- Schedule changes go through B07.
- Referenced Actions must be validated through B05.
- The approved plan must use the same underlying model as manual Planning.

### 9.4. Application Failure

If applying approved changes fails:

- Return the actual application result.
- Identify which operations succeeded or failed where the contract supports it.
- Do not mark failed operations as applied.
- Do not blindly retry non-idempotent operations.
- Preserve enough proposal state to support safe recovery.
- Avoid leaving partially applied data without a defined recovery strategy.

Whether a multi-module proposal must be applied atomically or can support partial application is OPEN and must be explicitly designed.

## 10. Application Operations

Logical operations:

| Operation | Purpose |
|---|---|
| `buildAIRequest(operation, context)` | Build an AI request |
| `executeAIRequest(request)` | Call the selected provider |
| `clarifyGoal(input)` | Run Goal clarification |
| `evaluateGoalFeasibility(input)` | Generate feasibility feedback |
| `generateGoalTreeProposal(goalContext)` | Generate a Goal Tree proposal |
| `generateDailyPlanProposal(context)` | Generate a Daily Plan proposal |
| `validateAIOutput(output, schema)` | Validate structured AI output |
| `createProposal(data)` | Create a proposal |
| `getProposal(proposalId)` | Retrieve a proposal |
| `updateProposal(proposalId, changes)` | Update editable proposal data |
| `approveProposal(proposalId, selection)` | Approve the whole proposal or selected items |
| `rejectProposal(proposalId)` | Reject a proposal |
| `applyApprovedProposal(proposalId)` | Apply approved changes through normal operations |

These are logical application operations, not final API endpoints.

Exact request and response contracts must be defined through D03 and D05.

## 11. Error Handling

| Error Code | Meaning |
|---|---|
| `AI_UNAUTHENTICATED` | User is not authenticated |
| `AI_ACCESS_DENIED` | User cannot access requested context or proposal |
| `AI_INVALID_REQUEST` | Invalid AI operation request |
| `AI_INVALID_OPERATION` | Unsupported AI operation |
| `AI_CONTEXT_NOT_FOUND` | Required context does not exist |
| `AI_CONTEXT_ACCESS_DENIED` | User cannot access context |
| `AI_CONTEXT_INSUFFICIENT` | Insufficient context for the requested operation |
| `AI_PROVIDER_UNAVAILABLE` | Provider is unavailable |
| `AI_PROVIDER_AUTH_FAILED` | Provider authentication failed |
| `AI_PROVIDER_RATE_LIMITED` | Provider rate limit reached |
| `AI_USAGE_LIMIT_EXCEEDED` | Usage limit reached |
| `AI_REQUEST_TIMEOUT` | Provider request timed out |
| `AI_PROVIDER_ERROR` | Provider returned an error |
| `AI_EMPTY_RESPONSE` | Provider returned no usable output |
| `AI_OUTPUT_INVALID` | AI output is structurally invalid |
| `AI_OUTPUT_TRUNCATED` | AI output is incomplete or truncated |
| `AI_OUTPUT_SEMANTIC_INVALID` | AI output violates expected semantic rules |
| `AI_PROPOSAL_NOT_FOUND` | Proposal does not exist |
| `AI_PROPOSAL_ACCESS_DENIED` | User cannot access proposal |
| `AI_PROPOSAL_INVALID_STATE` | Proposal cannot perform the requested operation |
| `AI_APPROVAL_REQUIRED` | Explicit user approval is required |
| `AI_PROPOSAL_VALIDATION_FAILED` | Proposal failed domain validation |
| `AI_PROPOSAL_APPLICATION_FAILED` | Applying approved changes failed |
| `AI_PROPOSAL_ALREADY_APPLIED` | Proposal has already been applied |
| `AI_PERSISTENCE_ERROR` | Failed to persist proposal data |
| `AI_UNKNOWN_ERROR` | Unexpected AI workflow error |

These error codes are proposed and must follow D06's shared error conventions.

**Error Rules:**

- Normalize provider-specific errors.
- Do not expose raw provider errors or internal credentials.
- Distinguish provider failure from output validation failure.
- Distinguish invalid proposal data from failed application operations.
- Do not persist invalid output as an approved proposal.
- Do not retry indefinitely.
- Do not automatically consume additional usage after a usage limit has been reached.
- Log operational failures without exposing unnecessary private user content.

## 12. Dependencies

| Dependency | Purpose |
|---|---|
| B01 Authentication & User Context | Resolve authenticated user |
| B02 Workspace & Project Management | Retrieve relevant Workspace/Project context |
| B03 Goal Management | Retrieve and apply approved Goal changes |
| B04 Milestone Management | Apply approved Milestone changes |
| B05 Action Management | Retrieve and apply approved Action changes |
| B06 Measurement Management | Retrieve and apply approved Measurement changes |
| B07 Planning & Scheduling | Retrieve planning context and apply approved plans |
| B08 Progress Engine | Retrieve authoritative progress information |
| C01 Identity & Ownership Rules | User ownership and access rules |
| C03 Goal & Hierarchy Rules | Goal validation |
| C04 Milestone Rules | Milestone validation |
| C05 Action Rules | Action validation |
| C06 Measurement Rules | Measurement validation |
| C07 Planning & Schedule Rules | Planning validation |
| D02 Authentication Integration | Authenticated identity |
| D03 Shared Types & Contracts | AI request and proposal schemas |
| D04 Validation | Structured output and input validation |
| D05 API / Application Communication | Application and module contracts |
| D06 Error Handling | Standardized errors |
| D07 Logging & Observability | Operational logging |
| D08 Security & Configuration | Provider credentials and secure integration |
| E01–E05 AI Capability | AI capability definitions |
| Selected AI Provider | AI inference service |

**Integration Rules:**

- B10 obtains identity through B01.
- B10 retrieves context through the relevant owning modules.
- B10 calls the AI Provider through the selected integration boundary.
- B10 validates output through D04 and the relevant domain contracts.
- B10 stores proposals separately from official domain data.
- B10 applies approved changes through normal business operations.
- Business modules must not independently implement provider calls.
- The frontend must not call a privileged AI provider API directly.

## 13. Security Requirements

- AI operations require authenticated access unless a separately approved public workflow exists.
- Resolve user ownership from trusted User Context.
- Never trust client-provided User IDs as proof of ownership.
- Retrieve only context the authenticated user can access.
- Keep provider API keys and privileged credentials server-side.
- Apply request-size and input limits.
- Protect against prompt injection and untrusted retrieved content.
- Treat AI output as untrusted input.
- Do not execute arbitrary code, SQL, or tool instructions from AI output.
- Do not allow AI to bypass business module validation.
- Do not allow AI to write directly into official domain data.
- Protect proposal records with user ownership checks.
- Avoid logging sensitive user context and full provider payloads unless explicitly required and appropriately protected.
- Apply D08's secret management and security requirements.
- Follow applicable provider data-handling and retention settings once the provider is selected.

## 14. Acceptance Criteria

B10 is acceptable for MVP when the following conditions are met.

**AI Request Context**
- The system builds requests from relevant user-approved context.
- The system retrieves only data the authenticated user is allowed to access.
- Irrelevant user data is not automatically included.
- Missing context is handled without fabricating information.

**AI Provider Integration**
- The system can send a request to the selected provider.
- Provider responses are normalized.
- Provider authentication errors are handled.
- Timeouts and rate limits are handled.
- Provider credentials are not exposed to the frontend.

**AI Capabilities**
- Goal clarification returns useful structured questions.
- Feasibility feedback includes assumptions and relevant caveats.
- Goal Tree generation returns structured proposal data.
- Basic Daily Plan generation returns editable proposal data.
- AI output does not become official data automatically.

**Output Validation**
- Invalid structured output is rejected.
- Semantically invalid output is rejected.
- Domain-invalid proposal items are not applied.
- Validation errors are returned in a structured form.

**Proposal Workflow**
- Users can retrieve their own proposals.
- Users can edit supported proposal data.
- Users can approve the complete proposal or selected items where supported.
- Users can reject proposals.
- Other users cannot access or modify a proposal.
- Rejected or invalid proposals cannot be applied.
- An applied proposal cannot be applied twice unintentionally.

**Approved Change Application**
- Approved Goal changes use B03.
- Approved Milestone changes use B04.
- Approved Action changes use B05.
- Approved Measurement changes use B06.
- Approved Planning changes use B07.
- All approved changes pass normal domain validation.
- Failed operations are not reported as successful.

**Security and Reliability**
- Unauthenticated requests are rejected.
- Cross-user context and proposal access are rejected.
- Provider failures do not corrupt official domain data.
- Usage limits are handled correctly.
- Sensitive credentials are not exposed.
- AI workflows do not prevent manual core workflows from operating.

## 15. Testing Requirements

**Unit Tests**
- AI request context assembly.
- Operation type validation.
- Provider response normalization.
- Structured output validation.
- Semantic output validation.
- Proposal creation.
- Proposal status transitions once approved.
- Proposal ownership validation.
- Proposal approval validation.
- Proposal application coordination.
- Error normalization.

**Integration Tests**
- Goal clarification with the selected provider.
- Goal feasibility feedback with the selected provider.
- Goal Tree proposal generation.
- Daily Plan proposal generation.
- Provider timeout.
- Provider rate limit.
- Provider authentication failure.
- Invalid structured response.
- Truncated response.
- Proposal persistence and retrieval.
- Proposal approval and rejection.
- Applying Goal Tree changes through B03–B06.
- Applying Daily Plan changes through B07.
- Failed application and recovery handling.

**Security Tests**
- Unauthenticated AI request.
- Forged client-provided User ID.
- Cross-user context retrieval.
- Cross-user proposal retrieval.
- Cross-user proposal approval.
- Provider secret exposure.
- Prompt injection through retrieved content.
- AI output attempting unsupported operations.
- AI output attempting to bypass domain validation.

**End-to-End Tests**
1. Enter Goal description → Receive clarification questions → Provide answers.
2. Submit clarified Goal → Receive feasibility feedback.
3. Request Goal Tree → Review proposal → Edit items → Approve selected items → Verify official data.
4. Request Daily Plan → Review proposal → Edit proposal → Approve → Verify B07 Planning data.
5. Generate proposal → Reject → Verify no official domain data is created.
6. Simulate provider failure → Verify error handling and manual workflow availability.

## 16. Implementation Order

| Step | Work | Dependency |
|---|---|---|
| 1 | Approve AI Provider and model | DEC-021 |
| 2 | Define AI integration boundary | D02 / D08 |
| 3 | Define AI request and response contracts | D03 |
| 4 | Define structured proposal schemas | D03 / D04 |
| 5 | Define AI context retrieval contracts | B02–B08 |
| 6 | Implement provider adapter | Selected Provider |
| 7 | Implement provider error normalization | D06 |
| 8 | Implement AI request context assembly | B01–B08 |
| 9 | Implement Goal clarification | E01 |
| 10 | Implement feasibility feedback | E02 |
| 11 | Implement Goal Tree proposal generation | E03 |
| 12 | Implement proposal validation and persistence | D01 / D03 / D04 |
| 13 | Implement proposal review and approval workflow | E04 |
| 14 | Implement approved Goal Tree application | B03–B06 |
| 15 | Implement Daily Plan proposal generation | E05 |
| 16 | Implement approved Planning application | B07 |
| 17 | Implement usage limits and failure handling | D06 / D08 |
| 18 | Integrate A10 AI Assistant Interface | A10 |
| 19 | Run integration and security tests | Required dependencies |

Implement capabilities in small, independently testable parts.

Do not build a complex agent framework before the MVP requires it.

## 17. Future Scope

The following capabilities are not included in the current MVP:

- Autonomous AI agents.
- Multi-agent collaboration.
- Long-term personalized memory.
- Continuous user behavior analysis.
- Automatic plan adjustment.
- Automatic Action execution.
- Advanced AI coaching.
- AI-powered Review diagnosis.
- Predictive Goal completion.
- Automatic provider routing and model selection.
- Custom model training and fine-tuning.
- Advanced prompt experimentation platform.
- Complex AI workflow builder.
- Voice-based Goal Assistant.
- Advanced AI observability and evaluation dashboards.

These capabilities require separate scope and architecture decisions.

## 18. Decisions and Implementation Baseline

| Item | Status | Notes |
|---|---|---|
| AI Goal Assistant in MVP | APPROVED — Blueprint MVP scope | Core product capability |
| Goal clarification | APPROVED — Blueprint E01 | Required AI capability |
| Goal feasibility feedback | APPROVED — Blueprint E02 | AI may challenge feasibility; user decides |
| Goal Tree proposal | APPROVED — Blueprint E03 | Structured proposal |
| Proposal user approval | APPROVED — DEC-009 / DEC-014 | AI does not directly commit official data |
| Basic AI Daily Plan proposal | APPROVED — DEC-013 | Included in MVP |
| Shared Planning model | APPROVED — DEC-012 | Manual and AI-assisted Planning use B07 |
| AI Provider and model | OPEN — DEC-021 | Requires explicit selection |
| AI request context schema | OPEN | Define minimum context per capability |
| Proposal persistence model | OPEN | Define entity and storage requirements |
| Proposal lifecycle | OPEN | Define states and transitions |
| Partial proposal approval | APPROVED — Blueprint E04 capability | User can accept selected items |
| Proposal application transaction | OPEN | Atomic or partial application and recovery |
| Provider fallback strategy | OPEN | No automatic fallback assumed |
| AI usage limits | OPEN | Define MVP limits and enforcement |
| Provider data retention settings | OPEN | Depends on selected provider |
| Raw provider response retention | OPEN | No requirement to retain full raw responses |
| AI prompt versioning | OPEN | Define minimum traceability needs |

**Open Product Owner Decisions:**

- AI-001: Which AI Provider and model will be selected under DEC-021?
- AI-002: What context is required for each AI capability?
- AI-003: Should proposals be persisted in the database or returned temporarily until the user saves/reviews them?
- AI-004: What is the official Proposal status lifecycle?
- AI-005: Should a proposal support partial approval at individual item level for every proposal type?
- AI-006: How should B10 handle partial failure when applying a multi-module proposal?
- AI-007: What are the MVP usage limits and retry rules?
- AI-008: What provider data retention and privacy settings are required?
- AI-009: What minimum prompt/model version information must be retained for debugging and reproducibility?

Only explicit Product Owner approval can change these decisions to APPROVED.

## 19. Ready-to-Code Status

**Specification Status:** DETAILED DESIGN — PARTIALLY BLOCKED

**Development Status:** BLOCKED — REQUIRED PROVIDER AND CONTRACT DECISIONS NOT YET APPROVED

**Implementation Status:** NOT_STARTED

**Ready Core:**
- B10 responsibility and module boundary.
- AI request orchestration concept.
- AI capability boundaries E01–E05.
- AI output validation principle.
- Separation between proposal data and official domain data.
- Explicit user approval requirement.
- Normal business operation requirement for applying approved changes.
- Basic provider failure and security requirements.

**Blocking Items:**
- DEC-021: AI Provider and model selection.
- AI request/response contracts.
- Context retrieval contracts from B02–B08.
- Proposal schema and persistence model.
- Proposal lifecycle and application rules.
- Multi-module application failure and recovery strategy.
- Usage limit and retry policy.
- Provider privacy and data retention settings.

**Implementation Rule:**

B10 must remain a controlled AI orchestration layer.

It builds requests from relevant user-approved context, coordinates AI capabilities, validates structured output, manages proposals, and applies explicitly approved changes through normal application/domain operations.

AI output is always untrusted until validated. AI must never bypass ownership checks, domain invariants, or user approval.

Do not turn B10 into an autonomous agent or allow it to become a second owner of business data.
# FLOW-UP — DOMAIN LAYER
## Domain Work Breakdown Structure (WBS)
**Version:** 0.2  
**Status:** PROPOSED  
**Layer:** C — Domain  
**Scope:** C01–C09  
**Purpose:** Establish a complete and implementation-oriented breakdown of the Domain Layer.

---

# 1. DOMAIN LAYER OVERVIEW

## 1.1. Purpose

The Domain Layer defines the business meaning, business rules, relationships, invariants, lifecycle behavior, and validation requirements of FLOW-UP.

It establishes a consistent set of business rules that all Functional Modules (B01–B10) must follow.

The Domain Layer must be sufficiently detailed to support:
- Database design.
- Application and service implementation.
- API contract definition.
- Business validation.
- Unit testing.
- Cross-module integration.
- Future platform expansion.

## 1.2. Domain Structure

```text
DOMAIN
│
├── C01. Identity & Ownership Rules
│
├── C02. Workspace & Project Rules
│
├── C03. Goal & Hierarchy Rules
│
├── C04. Milestone Rules
│
├── C05. Action Rules
│
├── C06. Measurement Rules
│
├── C07. Planning & Schedule Rules
│
├── C08. Progress Rules
│
└── C09. Review Rules
```

## 1.3. Domain Responsibility Groups

| Group | Domains | Business Responsibility |
|---|---|---|
| Identity & Organization | C01–C02 | Identity, ownership, workspace and project boundaries |
| Goal Structure | C03–C04 | Goal organization, hierarchy and milestones |
| Execution & Measurement | C05–C06 | Action execution and result measurement |
| Planning & Progress | C07–C08 | Scheduling, planning and progress calculation |
| Evaluation | C09 | Review and evaluation of actual results |

## 1.4. Domain Design Principles

Every Domain must follow these principles:

1. **Single Business Ownership:** Each business concept must have one clearly defined owner.
2. **Explicit Relationships:** Relationships between entities must be documented rather than inferred.
3. **Explicit Invariants:** Invalid business states must be identified and prevented.
4. **Explicit Lifecycle:** Status values and allowed transitions must be documented.
5. **Consistent Validation:** Validation rules must be defined at the Domain level.
6. **Separation of Concerns:** Domain rules must not depend on UI, HTTP, database vendors, or AI providers.
7. **Traceability:** Every important rule must be traceable to its owning Domain and Functional Module.
8. **Decision Transparency:** Unapproved rules must remain OPEN or PROPOSED.
9. **Implementation Readiness:** Domain specifications must provide sufficient detail for implementation and testing.

---

# FLOW-UP — C01 IDENTITY & OWNERSHIP RULES
## Domain Implementation Specification

**Document ID:** C01  
**Version:** 1.0  
**Layer:** C — Domain  
**Related Modules:** B01–B10  
**Related Infrastructure:** D01–D08  
**Status:** READY FOR IMPLEMENTATION — CORE SCOPE  
**Decision Status:** Core ownership rules specified; account lifecycle and extended access policies remain OPEN.

---

# 1. PURPOSE

C01 defines the identity and ownership rules used throughout FLOW-UP.

It establishes how an application user is identified, how resources are associated with their owner, how ownership is derived through related entities, and how cross-user access is prevented.

C01 provides the common identity and ownership rules that other Domain modules must follow.

C01 must ensure:

- Every user-owned resource has a valid ownership path.
- Ownership is consistent across related resources.
- A user cannot access another user's private resources.
- Related entities cannot be combined across unauthorized ownership boundaries.
- Ownership rules are consistent across B01–B10.
- Identity and ownership rules remain independent of authentication providers and presentation platforms.

# 2. SCOPE

## 2.1. Included

- Application User identity reference.
- Authentication identity and application identity distinction.
- User ownership model.
- Direct and inherited ownership.
- Resource ownership resolution.
- Workspace and Project ownership boundaries.
- Cross-user resource isolation.
- Ownership consistency validation.
- Identity and ownership invariants.
- Ownership-related validation contracts.
- Account lifecycle boundaries.
- Cross-domain ownership rules.

## 2.2. Excluded

- Login and logout.
- Password management.
- JWT issuance and validation.
- OAuth implementation.
- Authentication Provider integration.
- Session management.
- HTTP middleware.
- API endpoint implementation.
- UI authentication state.
- Database vendor and ORM implementation.
- Team collaboration and shared Workspace permissions.
- Role-based access control beyond the approved MVP ownership model.

These responsibilities belong to B01, D02, D05, D08 and other relevant system components.

# 3. DOMAIN RESPONSIBILITIES

C01 owns the following business concepts:

| Concept | Responsibility |
|---|---|
| Application User Identity | Stable application-level user reference |
| Resource Ownership | Rules determining who owns a resource |
| Direct Ownership | Ownership explicitly associated with a user |
| Inherited Ownership | Ownership derived through an approved relationship |
| Ownership Consistency | Ensuring related resources belong to compatible ownership scopes |
| Resource Isolation | Preventing unauthorized cross-user resource access |
| Identity Reference | Consistent user identity across Domain modules |

C01 does not own the business lifecycle of Workspace, Project, Goal, Milestone, Action, Measurement, Schedule, Progress or Review.

# 4. IDENTITY MODEL

## 4.1. Application User Identity

FLOW-UP must distinguish between:

1. Authentication Identity: Identity managed by an external authentication mechanism.
2. Application User Identity: Identity used by FLOW-UP to associate and own application resources.

Application User Identity is the authoritative identity reference inside the Domain Layer.

## 4.2. User Identity Requirements

An application user must have:

- A stable identifier.
- A valid identity reference.
- A consistent reference across modules.
- An identity lifecycle controlled through approved application operations.

The user identifier must not depend on:

- Email address.
- Display name.
- Username.
- Phone number.
- Authentication Provider access token.
- Authentication Provider session identifier.

These values may change and must not be treated as the authoritative resource ownership key.

## 4.3. Logical Application User Model

The following is a logical model, not a final database schema.

| Attribute | Type | Requirement | Description |
|---|---|---|---|
| id | UserId | Required | Stable application user identifier |
| status | UserStatus | OPEN | Application account status |
| created_at | Timestamp | Required | Creation timestamp |
| updated_at | Timestamp | Required | Last update timestamp |

Additional profile information is outside C01 unless explicitly required by another approved Domain.

## 4.4. Authentication Identity Mapping

The relationship between an external authentication identity and an application user must be handled by B01 and D02.

Conceptual relationship:

```text
Authentication Provider
        |
        v
External Authentication Identity
        |
        v
B01 / D02 Identity Resolution
        |
        v
Application User ID
        |
        v
C01 Ownership Rules
        |
        v
User-owned Domain Resources
```

C01 receives the resolved Application User ID.

C01 must not independently authenticate an external identity.

## 4.5. Identity Invariants

- Every authenticated application operation must resolve to a valid Application User ID.
- Application User ID must be stable.
- Resource ownership must use Application User ID rather than external authentication credentials.
- Authentication credentials must never be used as resource ownership identifiers.
- An unresolved identity must not be treated as a valid user.
- An invalid identity must not be allowed to own or access resources.

# 5. OWNERSHIP MODEL

## 5.1. Ownership Definition

Ownership identifies the Application User who is responsible for and has authority over a private resource within FLOW-UP.

For MVP, the ownership model is based on individual user ownership.

Team ownership and shared-resource permissions are excluded.

## 5.2. Ownership Types

C01 recognizes two ownership mechanisms.

### A. Direct Ownership

A resource directly stores or receives its owning Application User ID.

Examples:

- Personal Workspace ownership.
- Daily Plan ownership.
- Review ownership.

### B. Inherited Ownership

A resource derives its owner through an approved relationship to another resource.

Examples:

- Project ownership through Workspace.
- Milestone ownership through Goal.
- Measurement ownership through Goal.
- Schedule ownership through its related Action and/or Daily Plan according to the approved relationship model.

Inherited ownership must be resolved through authoritative relationships, not guessed from display data.

## 5.3. Ownership Resolution

A resource's effective owner is determined using its approved ownership model.

Conceptual operation:

```text
resolveOwner(resource):
    if resource has direct ownership:
        return its direct owner

    if resource has inherited ownership:
        resolve the owner through its authoritative parent relationship

    if no valid ownership path exists:
        return OWNERSHIP_UNRESOLVED
```

The implementation must not silently accept a resource with unresolved ownership.

## 5.4. Ownership Consistency

When multiple ownership paths exist, they must resolve to the same Application User ID.

Example:

```text
User A
  |
  v
Workspace A
  |
  v
Project A
  |
  v
Goal A
  |
  v
Milestone A
  |
  v
Action A
```

If Action A is associated with a Goal or Milestone whose ownership resolves to different users, the relationship is invalid.

The system must reject the inconsistent relationship.

## 5.5. Ownership Preservation

Ownership must remain consistent when resources are:

- Updated.
- Moved.
- Reassigned.
- Archived.
- Restored.
- Deleted.

Operations that change ownership or scope must be validated against the owning Domain's rules.

C01 does not independently perform Goal movement, Project movement or Action reassignment. It provides the ownership constraints those operations must satisfy.

# 6. RESOURCE OWNERSHIP MATRIX

The following matrix establishes the ownership model expected across FLOW-UP.

| Resource | Ownership Type | Ownership Source | Owner Domain |
|---|---|---|---|
| Application User | Root identity | Self identity | C01 |
| Personal Workspace | Direct | User ID | C02 |
| Project | Inherited | Workspace | C02 |
| Goal | Workspace/Project scope | Workspace ownership | C03 |
| Milestone | Inherited | Goal | C04 |
| Action | Inherited | Approved Goal/Milestone association | C05 |
| Measurement Definition | Inherited | Goal | C06 |
| Measurement Record | Inherited | Measurement Definition | C06 |
| Daily Plan | Direct | User ID | C07 |
| Schedule | Inherited | Action and/or Daily Plan | C07 |
| Progress Result | Derived | Source resources | C08 |
| Review | Direct | User ID | C09 |
| Review Note | Inherited | Review | C09 |

## 6.1. Ownership Matrix Rules

1. The matrix defines expected ownership, not final database columns.
2. Each resource must have exactly one effective owner in the MVP.
3. Direct ownership and inherited ownership must not conflict.
4. An inherited owner must be resolved through a valid relationship.
5. Resources with unresolved ownership must not be exposed to users.
6. Progress results must respect the ownership of their source resources.
7. The exact Action and Schedule ownership resolution depends on the final approved relationship cardinalities in C05 and C07.

## 6.2. Important Ownership Distinction

A resource may have a Project scope without being directly owned by the Project.

For example:

```text
User
  |
  v
Personal Workspace
  |
  v
Project
  |
  v
Goal
```

The Goal belongs to the Project scope but its effective owner remains the Workspace's owning User.

Project scope must not be confused with independent resource ownership.

# 7. RESOURCE ACCESS BOUNDARIES

## 7.1. MVP Access Model

FLOW-UP MVP uses private user ownership.

A user may access a resource only when the resource's effective owner matches the authenticated Application User ID, subject to the owning Domain's lifecycle and access rules.

## 7.2. Access Decision

Conceptual rule:

```text
canAccess(userId, resource):
    if userId is missing:
        return false

    ownerId = resolveOwner(resource)

    if ownerId is unresolved:
        return false

    return userId == ownerId
```

This rule defines the ownership condition.

B01 and the Application Layer remain responsible for integrating this condition into actual request authorization.

## 7.3. Access Through Relationships

Access to a parent resource does not automatically authorize access to a child resource owned by another user.

A child resource must satisfy both:

- Its own ownership rules.
- The ownership consistency rules of its parent relationship.

## 7.4. Cross-User Access Restrictions

The following operations must be rejected when ownership does not match:

- Retrieve another user's private resource.
- Update another user's private resource.
- Delete another user's private resource.
- Associate a resource with another user's Goal.
- Associate a resource with another user's Project.
- Modify a resource through an unauthorized parent relationship.
- Retrieve related data that crosses ownership boundaries.

## 7.5. Resource Isolation

Resource isolation must apply to:

- Direct resource retrieval.
- Resource listing.
- Resource search.
- Related-resource retrieval.
- Update operations.
- Delete operations.
- Bulk operations.
- Progress queries.
- Review data retrieval.
- AI context assembly.

A query must not return another user's resource simply because the caller knows its identifier.

# 8. OWNERSHIP VALIDATION RULES

## 8.1. Identity Validation

**OWN-001 — User Identity Required**

Operations requiring a user context must receive a valid Application User ID.

**OWN-002 — User Identity Exists**

The referenced Application User must exist according to the authoritative identity source.

**OWN-003 — User Identity Stable**

External identity changes must not silently change resource ownership.

## 8.2. Direct Ownership Validation

**OWN-004 — Direct Owner Required**

A resource requiring direct ownership must have a valid owner reference.

**OWN-005 — Direct Owner Match**

The owner of the resource must match the caller's authorized Application User ID when the operation requires private ownership.

**OWN-006 — Owner Modification Restricted**

A caller must not arbitrarily replace a resource's owner identifier.

Ownership transfer must use an explicitly approved operation.

## 8.3. Inherited Ownership Validation

**OWN-007 — Parent Ownership Valid**

A resource using inherited ownership must reference a valid parent resource.

**OWN-008 — Parent Ownership Match**

The ownership of a child resource must be consistent with its authoritative parent.

**OWN-009 — Multiple Ownership Paths Consistent**

When a resource has multiple ownership relationships, all applicable paths must resolve to the same owner.

**OWN-010 — Invalid Parent Relationship Rejected**

A resource cannot inherit ownership from an invalid or unauthorized parent.

## 8.4. Cross-Scope Validation

**OWN-011 — Workspace Scope Valid**

A resource must belong to a valid Workspace scope where required.

**OWN-012 — Project Scope Valid**

A Project-scoped resource must reference a Project within its valid Workspace.

**OWN-013 — Related Resource Ownership Match**

Related resources must satisfy the same effective ownership boundary.

**OWN-014 — Cross-User Relationship Rejected**

Relationships crossing private ownership boundaries must be rejected.

## 8.5. Access Validation

**OWN-015 — Unauthorized Read Rejected**

A user cannot read another user's private resource.

**OWN-016 — Unauthorized Write Rejected**

A user cannot modify another user's private resource.

**OWN-017 — Unauthorized Delete Rejected**

A user cannot delete another user's private resource.

**OWN-018 — List Isolation Required**

Resource lists and searches must be restricted to resources the caller is authorized to access.

## 8.6. Validation Order

Recommended validation sequence:

1. Resolve Application User ID.
2. Validate caller identity.
3. Load target resource through an ownership-aware access path.
4. Resolve effective resource owner.
5. Compare caller and resource ownership.
6. Validate parent and related resource ownership.
7. Execute the requested Domain operation.

The implementation must avoid exposing protected resource information before ownership validation.

# 9. IDENTITY AND OWNERSHIP LIFECYCLE

## 9.1. Application User Creation

When an application user is provisioned:

- A stable Application User ID must be established.
- The user identity must become available to B01.
- Resource ownership operations must be able to reference this identity.
- Personal Workspace initialization is handled by B02.

C01 does not create the Personal Workspace itself.

## 9.2. User Activation and Deactivation

The exact account status model remains OPEN.

If account activation or deactivation is introduced, its behavior must be coordinated between B01, C01 and D02.

C01 must not invent additional account statuses without approval.

## 9.3. Account Closure and Deletion

Account closure and deletion policy remains OPEN.

Before implementation, the Product Owner must decide:

- Whether account deletion is permanent or reversible.
- Whether user-owned resources are deleted or retained.
- Whether resources can be anonymized.
- Whether legal or operational retention is required.
- Whether historical Reviews and Progress records must remain.
- How external authentication identities are disconnected.

Until those decisions are approved:

- C01 must not implement automatic cascading deletion.
- C01 must not transfer ownership automatically.
- C01 must not permanently erase historical data.
- C01 must not assume that deactivation means deletion.

## 9.4. Ownership Changes

Ownership transfer is not included in the MVP core.

No resource may change its owner through an ordinary update operation.

Any future transfer feature must define:

- Authorized actor.
- Source owner.
- Target owner.
- Transferable resource types.
- Dependent resource behavior.
- Historical data handling.
- Transaction and consistency requirements.

# 10. DOMAIN OPERATIONS AND CONTRACTS

C01 provides reusable domain-level ownership operations.

The following contracts are logical and language-independent. They do not prescribe a framework or database implementation.

## 10.1. Resolve Application User

**Operation:** `resolveApplicationUser`

Input:
- External identity reference or authenticated application context, provided by B01.

Output:
- Application User ID.
- Identity resolution result.

Responsibility:
- B01/D02 resolve the external identity.
- C01 consumes the resulting Application User ID and applies domain identity rules.

## 10.2. Resolve Resource Owner

**Operation:** `resolveResourceOwner`

Input:
- Resource type.
- Resource identifier.
- Authoritative relationship context.

Output:
- Effective Owner User ID.
- Ownership resolution status.

Possible outcomes:
- `RESOLVED`
- `RESOURCE_NOT_FOUND`
- `OWNERSHIP_UNRESOLVED`
- `OWNERSHIP_INCONSISTENT`

## 10.3. Validate Resource Ownership

**Operation:** `validateResourceOwnership`

Input:
- Caller User ID.
- Resource reference.
- Ownership context.

Output:
- Valid or invalid.
- Validation error where applicable.

## 10.4. Validate Related Resource Ownership

**Operation:** `validateRelatedResourceOwnership`

Input:
- Caller User ID.
- Source resource reference.
- Related resource reference.
- Relationship type.

Output:
- Valid or invalid.
- Ownership consistency result.

## 10.5. Authorize Resource Access

**Operation:** `checkResourceOwnershipAccess`

Input:
- Caller User ID.
- Resource reference.
- Requested operation.

Output:
- Allowed or denied.
- Ownership validation result.

This operation supplies the ownership policy decision. B01/Application Layer integrates the decision into request authorization.

## 10.6. Contract Requirements

All operations must:

- Use Application User ID.
- Avoid authentication-provider-specific identifiers.
- Use authoritative ownership relationships.
- Fail closed when ownership cannot be resolved.
- Avoid leaking protected resource information.
- Return consistent domain error classifications.
- Remain independent of HTTP and database implementations.

# 11. ERROR MODEL

C01 must expose consistent ownership and identity error classifications.

| Error Code | Meaning |
|---|---|
| IDENTITY_REQUIRED | Application User ID is missing |
| IDENTITY_INVALID | Application User ID is invalid |
| IDENTITY_NOT_FOUND | Application User does not exist |
| IDENTITY_INACTIVE | Account is inactive, if the approved lifecycle supports this state |
| OWNERSHIP_REQUIRED | Required ownership information is missing |
| OWNERSHIP_UNRESOLVED | Effective owner cannot be resolved |
| OWNERSHIP_INCONSISTENT | Multiple ownership paths conflict |
| OWNERSHIP_MISMATCH | Caller and resource owners do not match |
| OWNERSHIP_MODIFICATION_FORBIDDEN | Unauthorized owner modification |
| RESOURCE_ACCESS_DENIED | Caller cannot access the resource |
| RELATED_RESOURCE_ACCESS_DENIED | Caller cannot access a related resource |
| CROSS_SCOPE_REFERENCE_INVALID | Related resource crosses an invalid scope |
| OWNERSHIP_VALIDATION_FAILED | General ownership validation failure |

Error handling requirements:

- Domain operations must produce meaningful domain errors.
- Application Layer maps Domain errors to API error responses.
- Error messages must not reveal another user's private resource details.
- Error codes must remain consistent across modules.

# 12. CROSS-DOMAIN INTEGRATION CONTRACTS

## 12.1. C01 ↔ C02: Workspace & Project

C01 provides:
- Application User identity.
- Ownership validation.
- User ownership boundaries.

C02 provides:
- Workspace ownership relationships.
- Project ownership through Workspace.
- Workspace and Project lifecycle.

Integration requirements:
- Each Personal Workspace must resolve to its owning User.
- Each Project must resolve to the same owner as its Workspace.
- Project-scoped resources must respect Workspace ownership.

## 12.2. C01 ↔ C03: Goal & Hierarchy

C01 provides:
- Effective owner validation.
- Cross-user isolation.

C03 provides:
- Goal ownership and scope.
- Parent–Child Goal relationships.

Integration requirements:
- Goal ownership must resolve through its valid Workspace scope.
- Parent and Child Goals must satisfy ownership consistency.
- Goal movement must preserve approved ownership rules.

## 12.3. C01 ↔ C04: Milestone

C04 owns Milestone and its Goal relationship.

C01 requires:
- Milestone ownership to resolve through Goal.
- Milestone relationships to respect Goal ownership.
- No cross-user Milestone association.

## 12.4. C01 ↔ C05: Action

C05 owns Action and execution behavior.

C01 requires:
- Action ownership to resolve through the approved Action association model.
- Goal and Milestone associations to satisfy ownership consistency.
- Execution data to remain within Action ownership boundaries.

The exact Action association cardinality remains governed by C05.

## 12.5. C01 ↔ C06: Measurement

C06 owns Measurement definitions and records.

C01 requires:
- Measurement ownership to resolve through Goal.
- Measurement records to inherit the correct ownership boundary.
- Measurement history to remain isolated between users.

## 12.6. C01 ↔ C07: Planning & Schedule

C07 owns Daily Plan and Schedule.

C01 requires:
- Daily Plan ownership to match its User.
- Schedule ownership to be consistent with its associated Action and/or Daily Plan.
- Schedule queries to enforce user ownership.
- Planning data to remain isolated between users.

Exact Schedule ownership cardinality remains governed by C07.

## 12.7. C01 ↔ C08: Progress

C08 owns authoritative Progress calculation rules.

C01 requires:
- Progress data retrieval to respect source ownership.
- Progress summaries to contain only authorized resources.
- Cross-user Progress aggregation to be rejected in the MVP.

## 12.8. C01 ↔ C09: Review

C09 owns Review and Review Notes.

C01 requires:
- Review ownership to match its User.
- Review Notes to inherit Review ownership.
- Review data sources to respect ownership boundaries.
- Cross-user source data must not enter a Review.

## 12.9. C01 ↔ B10: AI Orchestration

B10 must use approved Application User Context and ownership-aware domain operations.

C01 requires:
- AI context must only contain resources owned by or accessible to the current user.
- AI-generated resource references must undergo normal ownership validation.
- AI proposals must not bypass ownership constraints.
- AI application operations must use the same ownership rules as manual operations.

# 13. SECURITY AND DATA ISOLATION REQUIREMENTS

Although C01 is a Domain specification, its ownership rules must be enforced consistently throughout the system.

Required protections:

1. Never trust a client-supplied owner ID without validating it.
2. Never use an external authentication token as the resource owner.
3. Never retrieve private resources by identifier alone.
4. Never allow an invalid relationship to establish ownership.
5. Never rely exclusively on frontend filtering.
6. Never allow AI output to bypass ownership validation.
7. Never treat unresolved ownership as authorized access.
8. Never expose sensitive ownership details in error messages.

D08 owns technical security controls. D05 and the Application Layer enforce request-level integration. C01 defines the business ownership requirements.

# 14. ACCEPTANCE CRITERIA

C01 is accepted for the MVP core when all the following criteria pass.

### AC-001: Stable Application Identity

Given a valid Application User ID, all relevant Domain modules use the same identity reference.

### AC-002: Authentication Separation

Changing an external authentication credential does not silently change application resource ownership.

### AC-003: Direct Ownership

A directly owned resource resolves to its assigned Application User ID.

### AC-004: Inherited Ownership

A resource with inherited ownership resolves to the owner of its authoritative parent.

### AC-005: Ownership Consistency

Related resources with conflicting effective owners are rejected.

### AC-006: Cross-User Read Isolation

User A cannot retrieve User B's private resource.

### AC-007: Cross-User Write Isolation

User A cannot update User B's private resource.

### AC-008: Cross-User Delete Isolation

User A cannot delete User B's private resource.

### AC-009: Related Resource Isolation

User A cannot associate their resource with an unauthorized resource owned by User B.

### AC-010: Invalid Ownership

A resource with unresolved ownership cannot be treated as authorized.

### AC-011: List Isolation

Resource listing and search operations return only resources within the caller's authorized ownership boundary.

### AC-012: AI Ownership Validation

AI-generated references are validated using the same ownership rules as normal application operations.

### AC-013: Ownership Preservation

Operations performed by other Domain modules cannot silently change ownership.

### AC-014: Platform Independence

Ownership rules do not depend on browser, mobile or authentication-provider-specific behavior.

# 15. TESTING REQUIREMENTS

## 15.1. Unit Tests

Required test groups:

- Application User ID validation.
- Direct ownership resolution.
- Inherited ownership resolution.
- Ownership mismatch detection.
- Ownership inconsistency detection.
- Related-resource ownership validation.
- Access decision.
- Missing identity handling.
- Unresolved ownership handling.
- Invalid ownership modification handling.

## 15.2. Integration Tests

Required integration scenarios:

1. User A creates and accesses their own Workspace.
2. User A accesses a Project belonging to their Workspace.
3. User A accesses a Goal belonging to their Workspace or Project.
4. User A accesses a Milestone belonging to their Goal.
5. User A accesses an Action with valid ownership relationships.
6. User A accesses their Measurement records.
7. User A accesses their Daily Plan and Schedules.
8. User A accesses their Progress summaries.
9. User A accesses their Reviews and Review Notes.
10. User A attempts to access resources belonging to User B.
11. User A attempts to create a relationship with User B's resource.
12. An inconsistent ownership chain is rejected.

## 15.3. Negative Tests

The implementation must test:

- Missing Application User ID.
- Invalid Application User ID.
- Unknown resource.
- Unknown parent resource.
- Cross-user relationship.
- Conflicting ownership paths.
- Unauthorized owner modification.
- Unresolved ownership.
- Invalid scope relationship.
- Unauthorized AI proposal application.

## 15.4. Test Independence

Domain unit tests must not require:
- A live Authentication Provider.
- A browser.
- A running frontend.
- A specific database vendor.

Integration tests may use test infrastructure but must not depend on production credentials.

# 16. IMPLEMENTATION BOUNDARIES

## 16.1. C01 Must Implement

- Application User identity reference.
- Ownership types and ownership rules.
- Ownership resolution behavior.
- Ownership consistency validation.
- Resource ownership validation contracts.
- Cross-user ownership policy.
- Domain error classifications.
- Unit tests for C01 rules.

## 16.2. C01 Must Not Implement

- Login or registration UI.
- Password hashing.
- Token generation.
- JWT verification.
- OAuth callbacks.
- External identity-provider clients.
- HTTP authorization middleware.
- Workspace creation workflow.
- Project creation workflow.
- Goal creation workflow.
- Database schema for every business module.
- AI context generation.
- Progress calculation.

## 16.3. Dependency Boundaries

```text
B01 Authentication & User Context
                |
                v
        Application User ID
                |
                v
       C01 Identity & Ownership
                |
       Ownership Rules / Policies
                |
      +---------+----------+
      |         |          |
      v         v          v
     C02       C03        C04...
      |         |          |
      +---------+----------+
                |
                v
         Shared Domain Rules

D02: Authentication Integration
D03: Shared Types & Contracts
D04: Validation Infrastructure
D06: Error Handling
D08: Security & Configuration
```

C01 must not depend on a particular implementation of B01 or D02.

# 17. IMPLEMENTATION TASK BREAKDOWN

The following tasks define the C01 implementation work package.

| Task ID | Task | Deliverable |
|---|---|---|
| C01-IMP-001 | Define Application User ID abstraction | User identity type |
| C01-IMP-002 | Define ownership concepts | Ownership domain model |
| C01-IMP-003 | Define ownership source mapping | Ownership mapping |
| C01-IMP-004 | Implement direct ownership resolution | Direct owner resolver |
| C01-IMP-005 | Implement inherited ownership resolution | Inherited owner resolver |
| C01-IMP-006 | Implement ownership consistency validation | Ownership validator |
| C01-IMP-007 | Implement related-resource validation contract | Relationship validator |
| C01-IMP-008 | Implement access ownership policy | Ownership access policy |
| C01-IMP-009 | Define domain error classifications | Error definitions |
| C01-IMP-010 | Implement identity validation | Identity validator |
| C01-IMP-011 | Implement unit tests | C01 unit test suite |
| C01-IMP-012 | Implement integration test fixtures | Ownership test fixtures |
| C01-IMP-013 | Verify B01 integration contract | Identity integration verification |
| C01-IMP-014 | Verify C02–C09 ownership contracts | Cross-domain contract verification |
| C01-IMP-015 | Complete implementation documentation | C01 implementation notes |

## 17.1. Recommended Implementation Sequence

Phase 1 — Identity Foundation:
- C01-IMP-001
- C01-IMP-002
- C01-IMP-009
- C01-IMP-010

Phase 2 — Ownership Engine:
- C01-IMP-003
- C01-IMP-004
- C01-IMP-005
- C01-IMP-006

Phase 3 — Access and Relationship Validation:
- C01-IMP-007
- C01-IMP-008

Phase 4 — Verification:
- C01-IMP-011
- C01-IMP-012
- C01-IMP-013
- C01-IMP-014
- C01-IMP-015

# 18. OPEN DECISIONS

These decisions must not be silently implemented as approved business policy.

| Decision ID | Decision | Status | Implementation Impact |
|---|---|---|---|
| IDENTITY-001 | Exact Application User status model | OPEN | User lifecycle |
| IDENTITY-002 | User deactivation behavior | OPEN | Access behavior |
| IDENTITY-003 | Account deletion and data retention policy | OPEN | Historical resources |
| IDENTITY-004 | Ownership transfer support | OPEN | Future ownership operations |
| IDENTITY-005 | External identity mapping cardinality | OPEN | B01/D02 integration |
| IDENTITY-006 | Exact resource ownership storage strategy | OPEN | D01 schema |
| IDENTITY-007 | Exact Action ownership resolution | OPEN | C05 relationship model |
| IDENTITY-008 | Exact Schedule ownership resolution | OPEN | C07 relationship model |
| IDENTITY-009 | Shared-resource permissions beyond personal ownership | OUT OF MVP SCOPE | Future collaboration |

## 18.1. Core Implementation Policy

The OPEN decisions above do not all block the implementation of the basic ownership engine.

The implementation may proceed with these boundaries:

- Use a stable Application User ID.
- Use one effective owner per private resource.
- Use direct or inherited ownership as defined by the approved resource model.
- Reject unresolved ownership.
- Reject inconsistent ownership.
- Reject cross-user access.
- Do not implement ownership transfer.
- Do not implement account deletion or automatic cascading deletion.
- Do not invent additional account lifecycle states.
- Do not finalize database storage until D01 design.

If a future decision changes the core ownership model, the affected implementation must be reviewed before release.

# 19. IMPLEMENTATION HANDOFF CONTRACT

This section is the handoff boundary between Domain Design and the Code Factory.

## 19.1. Input Documents

The implementation agent must receive:

1. Master Blueprint v0.4.
2. B01 Authentication & User Context Specification.
3. B02 Workspace & Project Specification.
4. C01 Identity & Ownership Rules — this document.
5. Current Decision Log.
6. D03 Shared Types & Contracts, when available.
7. D04 Validation conventions, when available.
8. D06 Error Handling conventions, when available.

## 19.2. Implementation Instructions

The Code Factory must:

- Inspect the existing repository before creating files.
- Follow the approved repository structure and coding conventions.
- Identify the existing language, framework and dependency versions.
- Reuse existing shared types and contracts where available.
- Avoid inventing project directories or changing unrelated modules.
- Keep Domain logic independent of infrastructure.
- Implement only C01 responsibilities.
- Avoid implementing B01 authentication flows.
- Avoid implementing D02 authentication integration.
- Avoid creating database schemas before D01 design is approved.
- Add unit tests for every implemented core ownership rule.
- Add integration tests for ownership boundaries where dependencies exist.
- Document any implementation blocker or missing contract.
- Report any conflict between this specification and existing source documents.
- Never silently convert OPEN decisions into APPROVED decisions.

## 19.3. Expected Code Factory Output

The implementation agent must return:

1. Repository inspection summary.
2. C01 implementation plan.
3. Files created or modified.
4. Identity and ownership implementation.
5. Unit tests.
6. Integration tests or documented blockers.
7. Test execution results.
8. Known limitations.
9. OPEN decisions that affect implementation.
10. C01 completion report.

The implementation agent must not claim completion when tests have not been executed successfully.

# 20. DEFINITION OF DONE

C01 is considered `IMPLEMENTED & VERIFIED` when:

- Application User ID is represented consistently.
- Direct ownership rules are implemented.
- Inherited ownership rules are implemented for approved relationships.
- Ownership consistency is validated.
- Cross-user access is rejected.
- Invalid ownership is rejected.
- Ownership cannot be modified through unauthorized operations.
- Domain error classifications are consistent.
- Unit tests pass.
- Available integration tests pass.
- C01 does not depend on authentication-provider implementation.
- No unresolved core ownership conflict remains.
- Implementation notes and limitations are documented.

---

# 21. FINAL STATUS

**Domain:** C01 — Identity & Ownership Rules

**Design Status:** CORE SPECIFICATION COMPLETE

**Implementation Status:** READY FOR IMPLEMENTATION — CORE SCOPE

**Not Included in This Readiness:**
- Final account lifecycle policy.
- Account deletion and retention.
- Ownership transfer.
- Shared Workspace permissions.
- Final database schema.
- Unresolved Action and Schedule cardinalities.

**Implementation Principle:**

C01 is the shared ownership foundation of FLOW-UP. Every business module must follow the same ownership rules, but each module remains responsible for its own business entities and lifecycle.

The implementation must prioritize correctness, isolation, testability and platform independence over premature infrastructure coupling.

# FLOW-UP — C02 WORKSPACE & PROJECT RULES
## Domain Implementation Specification

**Document ID:** C02  
**Version:** 1.0  
**Layer:** C — Domain  
**Related Modules:** B01, B02, B03  
**Related Domains:** C01, C03–C09  
**Infrastructure Dependencies:** D01–D08  
**Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED  
**Decision Status:** Core Workspace and Project ownership rules specified; lifecycle and Goal movement policies remain partially OPEN.

---

# 1. PURPOSE

C02 defines the business rules governing Workspace and Project organization in FLOW-UP.

It establishes:

- How a Personal Workspace is associated with an Application User.
- How Projects are organized within a Workspace.
- How Goals belong to either an independent Workspace scope or a Project scope.
- How Workspace and Project ownership boundaries are maintained.
- How Workspace and Project lifecycle operations affect their dependent resources.
- How invalid scope relationships are prevented.
- How Goal scope changes are validated in coordination with C03.

C02 provides the organizational foundation for all business resources managed by FLOW-UP.

# 2. SCOPE

## 2.1. Included

- Workspace business concept.
- Personal Workspace.
- Workspace ownership.
- Workspace resource boundaries.
- Project business concept.
- Project ownership through Workspace.
- Workspace–Project relationship.
- Project–Goal relationship.
- Independent Workspace Goal.
- Project-owned Goal.
- Workspace and Project lifecycle rules.
- Goal scope validation.
- Goal scope movement constraints.
- Workspace and Project invariants.
- Cross-domain integration contracts.

## 2.2. Excluded

- Authentication and User Context.
- Goal creation and modification.
- Goal hierarchy implementation.
- Milestone management.
- Action management.
- Measurement management.
- Planning and Schedule management.
- Progress calculation.
- Review management.
- UI and navigation.
- HTTP endpoint implementation.
- Database vendor and ORM implementation.
- Team collaboration.
- Shared Workspace permissions.
- Project member management.
- Project-level role and permission management.

These responsibilities belong to B01–B10 and their respective Domain modules.

# 3. DOMAIN RESPONSIBILITIES

C02 owns the following business concepts:

| Concept | Responsibility |
|---|---|
| Workspace | Personal organizational boundary |
| Personal Workspace | User's primary personal working environment |
| Workspace Ownership | Relationship between User and Workspace |
| Project | Optional organizational container inside Workspace |
| Project Ownership | Ownership inherited through Workspace |
| Goal Scope | Classification of Goal as independent or Project-owned |
| Scope Consistency | Ensuring Project and Goal belong to compatible Workspace boundaries |
| Workspace Lifecycle | Business lifecycle of Personal Workspace |
| Project Lifecycle | Business lifecycle of Project |
| Scope Movement Constraints | Workspace and Project conditions for Goal movement |

C02 does not own the Goal entity or Goal hierarchy.

C03 owns Goal behavior and hierarchy. C02 supplies Workspace and Project scope constraints.

# 4. WORKSPACE DOMAIN MODEL

## 4.1. Workspace Definition

A Workspace is the primary personal organizational boundary of FLOW-UP.

It provides a logical container for:

- Independent Goals.
- Projects.
- Other resources associated with the user's Workspace scope.

For MVP, each Application User has one Personal Workspace.

## 4.2. Personal Workspace Rules

The following rules apply:

- A Personal Workspace belongs to exactly one Application User.
- A User must not have multiple Personal Workspaces in the MVP.
- A Personal Workspace must have a stable identifier.
- A Personal Workspace must be associated with a valid Application User.
- A Personal Workspace is the root organizational boundary for that User's Projects and independent Goals.
- Workspace ownership must remain consistent with C01.

The one-Personal-Workspace-per-User rule is part of the current MVP architecture baseline.

## 4.3. Logical Workspace Model

The following is a logical model, not a final database schema.

| Attribute | Type | Requirement | Description |
|---|---|---|---|
| id | WorkspaceId | Required | Stable Workspace identifier |
| owner_user_id | UserId | Required | Owning Application User |
| name | String | OPEN | Workspace display name |
| status | WorkspaceStatus | OPEN | Workspace lifecycle status |
| created_at | Timestamp | Required | Creation timestamp |
| updated_at | Timestamp | Required | Last update timestamp |
| archived_at | Timestamp | OPEN | Archival timestamp, if supported |

The exact name and status requirements must be confirmed before final schema design.

## 4.4. Workspace Identity

Workspace identity must be independent of:

- User display name.
- User email.
- Project name.
- Authentication Provider identity.
- Browser or mobile client identifiers.

Workspace ID is the authoritative reference for Workspace relationships.

## 4.5. Workspace Ownership

Workspace ownership is direct ownership by an Application User.

The effective owner of a Workspace is its `owner_user_id`.

C02 must follow C01 identity and ownership rules.

## 4.6. Workspace Resource Boundaries

A Workspace may contain:

- Projects.
- Independent Goals.
- Other explicitly approved Workspace-scoped resources.

A Project must belong to one Workspace.

A Goal must belong to a valid Workspace scope, either independently or through a Project.

Resources belonging to different Workspaces must not be combined through invalid relationships.

# 5. PROJECT DOMAIN MODEL

## 5.1. Project Definition

A Project is an optional organizational container within a Workspace.

It groups related Goals under a common organizational context.

A Project does not replace a Goal and does not independently define the outcome being pursued.

## 5.2. Project Rules

- A Project belongs to exactly one Workspace.
- A Workspace may contain zero or more Projects.
- A Project must have a stable identifier.
- A Project must have a valid Workspace reference.
- A Project inherits its effective owner through its Workspace.
- A Project is optional.
- A User may create and manage independent Goals without creating any Project.

## 5.3. Logical Project Model

The following is a logical model, not a final database schema.

| Attribute | Type | Requirement | Description |
|---|---|---|---|
| id | ProjectId | Required | Stable Project identifier |
| workspace_id | WorkspaceId | Required | Parent Workspace |
| name | String | Required | Project name |
| description | String | Optional | Project description |
| status | ProjectStatus | OPEN | Project lifecycle status |
| created_at | Timestamp | Required | Creation timestamp |
| updated_at | Timestamp | Required | Last update timestamp |
| archived_at | Timestamp | OPEN | Archival timestamp, if supported |

No final database column or enum values are approved solely by this logical model.

## 5.4. Project Ownership

Project ownership is inherited from its Workspace.

Conceptual model:

```text
Application User
       |
       v
Personal Workspace
       |
       v
Project
```

The effective owner of a Project is the owner of its Workspace.

A Project must not have an independent owner that conflicts with its Workspace owner.

## 5.5. Project Scope

A Project defines an organizational scope for Goals.

A Goal associated with a Project must belong to the same Workspace as that Project.

A Project is not a replacement for Workspace ownership.

# 6. WORKSPACE–PROJECT RELATIONSHIPS

## 6.1. Relationship Model

The approved MVP relationship is:

```text
User 1
  |
  | 1:1
  |
Workspace
  |
  | 1:N
  |
Project
```

## 6.2. Cardinality Rules

| Relationship | Cardinality | Status |
|---|---|---|
| User–Personal Workspace | One-to-one | APPROVED |
| Workspace–Project | One-to-many | APPROVED |
| Project–Workspace | Many-to-one | APPROVED |

## 6.3. Relationship Invariants

- A Workspace must have exactly one owner.
- A User must have at most one Personal Workspace in the MVP.
- A Project must belong to exactly one Workspace.
- A Workspace may exist without any Projects.
- A Project cannot exist without a valid Workspace.
- A Project cannot belong to multiple Workspaces.
- A Project cannot have an owner different from its Workspace owner.

## 6.4. Workspace and Project Ownership Resolution

Workspace ownership:

`Workspace.owner_user_id`

Project ownership:

`Project.workspace_id -> Workspace.owner_user_id`

The implementation must resolve Project ownership through the authoritative Workspace relationship.

# 7. GOAL SCOPE CLASSIFICATION

## 7.1. Purpose

C02 defines the organizational scope in which a Goal exists.

C03 owns the Goal entity and hierarchy. C02 defines the valid Workspace and Project context for that Goal.

## 7.2. Supported Goal Scopes

The MVP supports two conceptual Goal scopes.

### A. Independent Workspace Goal

An independent Goal belongs directly to a Workspace and is not assigned to a Project.

Conceptual representation:

```text
User
  |
  v
Workspace
  |
  v
Independent Goal
```

### B. Project-owned Goal

A Project-owned Goal belongs to a Project within a Workspace.

Conceptual representation:

```text
User
  |
  v
Workspace
  |
  v
Project
  |
  v
Goal
```

## 7.3. Logical Goal Scope Model

The conceptual Goal scope can be represented as:

| Field | Description |
|---|---|
| workspace_id | Workspace containing the Goal |
| project_id | Optional Project association |

These fields describe the scope concept only.

The final storage representation must be agreed with C03 and D01.

## 7.4. Goal Scope Invariants

- Every Goal must belong to a valid Workspace scope.
- An independent Goal must not reference a Project.
- A Project-owned Goal must reference a valid Project.
- The Project must belong to the same Workspace as the Goal.
- A Goal must not reference a Project from another User's Workspace.
- A Goal's effective owner must remain consistent with its Workspace owner.
- Project scope must not create a second independent ownership identity.

## 7.5. Scope Identification

The conceptual scope classification is:

```text
if project_id is null:
    scope = INDEPENDENT_WORKSPACE

if project_id is valid:
    scope = PROJECT
```

This classification is conceptual. It must be implemented using the final approved Goal model from C03.

## 7.6. Goal Hierarchy and Scope

Goal hierarchy behavior belongs to C03.

C02 establishes the following constraints:

- Parent and Child Goals must belong to compatible Workspace ownership boundaries.
- A Project-scoped hierarchy must respect the approved Project scope rules.
- A hierarchy change must not create cross-user resource relationships.
- Moving a Goal between scopes must not bypass Workspace ownership validation.

Whether Child Goals may have a different Project scope from their Parent Goal remains OPEN and must be resolved jointly by C02 and C03.

# 8. WORKSPACE LIFECYCLE

## 8.1. Workspace Initialization

When a new Application User is provisioned:

- A Personal Workspace must be initialized according to B02.
- The Workspace must be associated with the correct Application User ID.
- Duplicate Personal Workspace creation must be prevented.
- Workspace initialization must respect C01 ownership rules.

C02 defines the business constraint. B02 owns the application operation.

## 8.2. Workspace Availability

A Workspace is available when it satisfies the approved Workspace lifecycle rules.

Resources must not be created or modified under an invalid or unavailable Workspace.

The exact Workspace status model remains OPEN.

## 8.3. Workspace Archival and Deactivation

Workspace archival and deactivation are not approved MVP capabilities.

Their behavior remains OPEN.

The implementation must not assume:

- Archiving a Workspace automatically archives every Project.
- Deactivating a Workspace automatically deactivates all resources.
- Workspace archival is equivalent to deletion.

## 8.4. Workspace Deletion

Workspace deletion policy remains OPEN.

Before implementation, the Product Owner must decide:

- Whether Workspace deletion is supported.
- Whether Workspace deletion requires prior account deletion.
- Whether Projects are deleted, archived or retained.
- Whether independent Goals are deleted, archived or retained.
- How historical Actions, Measurements, Schedules, Progress and Reviews are handled.
- Whether deletion is reversible.
- Whether retention requirements apply.

Until approved:

- Do not implement cascading deletion.
- Do not automatically transfer ownership.
- Do not permanently remove dependent resources.
- Do not bypass C01 ownership validation.

# 9. PROJECT LIFECYCLE

## 9.1. Project Creation

A Project may be created within a valid Workspace.

Required conditions:

- Workspace exists.
- Caller owns the Workspace.
- Workspace is available for Project creation.
- Project name satisfies the approved validation rules.

## 9.2. Project Activation

Project activation behavior depends on the final approved Project status model.

No additional lifecycle states may be invented during implementation.

## 9.3. Project Completion

Project completion is distinct from Goal completion.

C02 must not assume:

- Completing all Goals automatically completes a Project.
- Completing a Project automatically completes all Goals.
- Project completion automatically changes Action or Milestone statuses.

Project completion criteria remain OPEN and must be coordinated with C08 and B02.

## 9.4. Project Archival

Project archival behavior remains OPEN.

The specification must eventually define:

- Whether an archived Project can be viewed.
- Whether Goals can be modified.
- Whether new Goals can be assigned.
- Whether existing Actions can be executed.
- Whether Schedules remain available.
- Whether restoration is supported.

Until approved, the implementation must not invent cascading archival behavior.

## 9.5. Project Restoration

Project restoration is not assumed to be supported until the lifecycle model is approved.

If restoration is approved, dependent resource consistency must be preserved.

## 9.6. Project Deletion

Project deletion policy remains OPEN.

The following must be resolved:

- Hard delete or soft delete.
- Whether associated Goals are deleted, moved or retained.
- Whether Goal history must be preserved.
- Effects on Milestones and Actions.
- Effects on Measurements and records.
- Effects on Schedules.
- Effects on Progress history.
- Effects on Reviews.
- Whether deletion is allowed for a Project with active resources.

Until approved, no automatic cascading deletion is permitted.

# 10. GOAL SCOPE MOVEMENT RULES

## 10.1. Purpose

Goal scope movement changes the organizational context of an existing Goal.

C02 defines Workspace and Project conditions for these operations.

C03 owns the Goal movement operation and Goal hierarchy behavior.

## 10.2. Supported Conceptual Movement Types

The architecture recognizes:

1. Independent Workspace Goal → Project-owned Goal.
2. Project-owned Goal → Independent Workspace Goal.
3. Project A Goal → Project B Goal.
4. Goal movement within a Goal hierarchy.

These are conceptual operation categories. Exact MVP support and behavior remain subject to approval.

## 10.3. Preconditions

Any Goal scope movement must verify:

- The source Goal exists.
- The caller owns the source Workspace.
- The destination Workspace exists.
- The destination Project exists if Project scope is requested.
- The caller owns the destination Workspace.
- The destination Project belongs to the destination Workspace.
- The movement does not violate C03 hierarchy rules.
- The movement does not create invalid relationships.
- All dependent resources remain within valid ownership boundaries.

## 10.4. Identity Preservation

A permitted Goal movement must preserve the Goal's identity.

The movement must not create a new Goal merely to change its scope.

Related resource identities must also remain stable unless an explicitly approved operation requires otherwise.

## 10.5. Related Resource Preservation

A Goal may have:

- Child Goals.
- Milestones.
- Actions.
- Measurements.
- Measurement records.
- Schedules associated with Actions.
- Progress data.
- Reviews.

Movement operations must not silently delete or recreate these resources.

Their scope and ownership consistency must be validated after movement.

## 10.6. Movement Transaction Requirements

A movement operation must not leave the system in an invalid partial state.

The application implementation must ensure:

- All required validation occurs before applying the movement.
- The final Goal scope is valid.
- Related ownership boundaries remain consistent.
- Failed movement does not leave partially updated relationships.
- Multi-module effects are handled through an explicitly designed transaction or recovery strategy.

The exact transaction boundary and multi-module update strategy remain OPEN for D01 and the relevant Application Modules.

## 10.7. Parent–Child Movement

The following decisions remain OPEN:

- Whether moving a Parent Goal automatically moves all descendants.
- Whether a Child Goal can be moved independently.
- Whether Parent and Child Goals may belong to different Projects.
- Whether movement requires confirmation when related resources exist.
- How scheduled Actions are handled during movement.

C02 must not independently decide these C03 hierarchy rules.

# 11. BUSINESS INVARIANTS

The following invariants define the core C02 behavior.

**WS-001 — Personal Workspace Ownership**

Every Personal Workspace must have exactly one valid owning Application User.

**WS-002 — One Personal Workspace**

A User must not have multiple Personal Workspaces in the MVP.

**WS-003 — Workspace Identity Stability**

Workspace identity must remain stable during normal updates.

**WS-004 — Project Workspace Required**

Every Project must belong to exactly one valid Workspace.

**WS-005 — Project Ownership Inheritance**

A Project inherits ownership from its Workspace.

**WS-006 — Project Owner Consistency**

A Project cannot have an effective owner different from its Workspace owner.

**WS-007 — Independent Goal Scope**

An independent Goal must belong directly to a valid Workspace and must not reference a Project.

**WS-008 — Project Goal Scope**

A Project-owned Goal must reference a valid Project.

**WS-009 — Goal Workspace Consistency**

A Project-owned Goal and its Project must resolve to the same Workspace.

**WS-010 — Cross-User Scope Rejection**

A Goal cannot be associated with a Project belonging to another User.

**WS-011 — Workspace Resource Isolation**

Workspace resources must remain within the Workspace's ownership boundary.

**WS-012 — Scope Movement Preservation**

Permitted Goal movement must preserve Goal identity.

**WS-013 — Dependent Resource Integrity**

Scope movement must not create invalid ownership or resource relationships.

**WS-014 — No Unapproved Cascade**

Workspace or Project lifecycle operations must not automatically delete or archive dependent resources without an approved rule.

**WS-015 — Project Optionality**

Independent Goals must remain valid without a Project.

# 12. VALIDATION RULES

## 12.1. Workspace Validation

**WSV-001 — Workspace Exists**

Referenced Workspace must exist.

**WSV-002 — Workspace Owner Valid**

Workspace must reference a valid Application User.

**WSV-003 — Workspace Owner Match**

Caller must own the Workspace when performing private operations.

**WSV-004 — Workspace Uniqueness**

A User must not have more than one Personal Workspace in the MVP.

**WSV-005 — Workspace Availability**

Operations must respect the approved Workspace lifecycle.

## 12.2. Project Validation

**WSV-006 — Project Exists**

Referenced Project must exist.

**WSV-007 — Project Workspace Required**

A Project must reference a valid Workspace.

**WSV-008 — Project Owner Consistency**

Project ownership must resolve through its Workspace.

**WSV-009 — Project Name Valid**

Project name must satisfy the approved input constraints.

**WSV-010 — Project Lifecycle Valid**

Operations must respect the approved Project lifecycle.

## 12.3. Goal Scope Validation

**WSV-011 — Goal Workspace Required**

A Goal must have a valid Workspace scope.

**WSV-012 — Independent Goal Project Null**

An independent Goal must not contain an invalid Project reference.

**WSV-013 — Project Goal Valid**

A Project-owned Goal must reference an existing Project.

**WSV-014 — Goal Project Workspace Match**

The Goal and its Project must belong to the same Workspace.

**WSV-015 — Goal Ownership Match**

The Goal's effective owner must match its Workspace owner.

## 12.4. Scope Movement Validation

**WSV-016 — Source Scope Valid**

The source Goal must have a valid current scope.

**WSV-017 — Destination Scope Valid**

The destination Workspace and optional Project must be valid.

**WSV-018 — Destination Ownership Match**

The caller must own the destination Workspace.

**WSV-019 — Hierarchy Scope Valid**

Movement must satisfy C03 hierarchy rules.

**WSV-020 — Dependent Resource Integrity**

Movement must preserve required dependent relationships.

**WSV-021 — Movement Atomicity**

A failed movement must not leave partially updated scope relationships.

# 13. DOMAIN OPERATIONS AND CONTRACTS

C02 defines the business-level operations and their expected inputs and outputs.

These contracts do not prescribe HTTP endpoints or a specific programming language.

## 13.1. Validate Workspace Ownership

**Operation:** `validateWorkspaceOwnership`

Input:
- Caller User ID.
- Workspace ID.

Output:
- Ownership validation result.

Possible outcomes:
- `VALID`
- `WORKSPACE_NOT_FOUND`
- `WORKSPACE_ACCESS_DENIED`
- `WORKSPACE_OWNER_INVALID`

## 13.2. Resolve Project Ownership

**Operation:** `resolveProjectOwner`

Input:
- Project ID.

Output:
- Project ID.
- Workspace ID.
- Effective Owner User ID.
- Resolution status.

Possible outcomes:
- `RESOLVED`
- `PROJECT_NOT_FOUND`
- `WORKSPACE_NOT_FOUND`
- `OWNERSHIP_UNRESOLVED`
- `OWNERSHIP_INCONSISTENT`

## 13.3. Validate Project Scope

**Operation:** `validateProjectScope`

Input:
- Caller User ID.
- Project ID.
- Workspace ID.

Output:
- Scope validation result.

Possible outcomes:
- `VALID`
- `PROJECT_NOT_FOUND`
- `WORKSPACE_NOT_FOUND`
- `PROJECT_WORKSPACE_MISMATCH`
- `PROJECT_ACCESS_DENIED`

## 13.4. Validate Goal Scope

**Operation:** `validateGoalScope`

Input:
- Goal reference.
- Workspace ID.
- Optional Project ID.

Output:
- Goal scope validation result.

Possible outcomes:
- `VALID_INDEPENDENT_SCOPE`
- `VALID_PROJECT_SCOPE`
- `WORKSPACE_NOT_FOUND`
- `PROJECT_NOT_FOUND`
- `GOAL_PROJECT_WORKSPACE_MISMATCH`
- `GOAL_SCOPE_INVALID`
- `GOAL_SCOPE_ACCESS_DENIED`

C02 validates scope constraints. C03 owns the actual Goal entity operation.

## 13.5. Validate Goal Scope Movement

**Operation:** `validateGoalScopeMovement`

Input:
- Caller User ID.
- Source Goal reference.
- Destination Workspace ID.
- Optional destination Project ID.
- Hierarchy context.

Output:
- Movement validation result.
- Blocking conditions.

Possible outcomes:
- `VALID`
- `SOURCE_SCOPE_INVALID`
- `DESTINATION_SCOPE_INVALID`
- `DESTINATION_ACCESS_DENIED`
- `PROJECT_WORKSPACE_MISMATCH`
- `HIERARCHY_SCOPE_INVALID`
- `DEPENDENT_RESOURCE_CONFLICT`

## 13.6. Contract Requirements

All C02 operations must:

- Respect C01 ownership rules.
- Use stable identifiers.
- Validate authoritative relationships.
- Reject unresolved ownership.
- Reject invalid Workspace and Project scope.
- Avoid modifying entities owned by C03 or other Domains.
- Remain independent of HTTP and database vendors.

# 14. ERROR MODEL

| Error Code | Meaning |
|---|---|
| WORKSPACE_NOT_FOUND | Workspace does not exist |
| WORKSPACE_ACCESS_DENIED | Caller does not own or cannot access Workspace |
| WORKSPACE_OWNER_INVALID | Workspace owner is invalid |
| WORKSPACE_ALREADY_EXISTS | User already has a Personal Workspace |
| WORKSPACE_UNAVAILABLE | Workspace is unavailable under approved lifecycle rules |
| WORKSPACE_INVALID_STATE | Workspace operation is invalid for its current state |
| PROJECT_NOT_FOUND | Project does not exist |
| PROJECT_ACCESS_DENIED | Caller cannot access Project |
| PROJECT_WORKSPACE_REQUIRED | Project has no valid Workspace |
| PROJECT_WORKSPACE_MISMATCH | Project and related resource belong to different Workspaces |
| PROJECT_INVALID_NAME | Project name is invalid |
| PROJECT_INVALID_STATE | Project operation is invalid for its current state |
| GOAL_SCOPE_INVALID | Goal scope is invalid |
| GOAL_PROJECT_NOT_FOUND | Referenced Project does not exist |
| GOAL_PROJECT_WORKSPACE_MISMATCH | Goal and Project do not share the same Workspace |
| GOAL_SCOPE_ACCESS_DENIED | Caller cannot access the requested Goal scope |
| GOAL_SCOPE_MOVEMENT_INVALID | Requested scope movement is invalid |
| GOAL_SCOPE_MOVEMENT_BLOCKED | Movement is blocked by related resources or rules |
| WORKSPACE_DEPENDENCY_CONFLICT | Workspace operation conflicts with dependent resources |
| PROJECT_DEPENDENCY_CONFLICT | Project operation conflicts with dependent resources |
| SCOPE_VALIDATION_FAILED | General scope validation failure |

Error mapping:

- Domain operations produce domain error classifications.
- Application Layer maps them to API responses.
- D06 defines shared error response conventions.
- Error messages must not expose another user's private resource information.

# 15. CROSS-DOMAIN INTEGRATION CONTRACTS

## 15.1. C02 ↔ C01: Identity & Ownership

C01 provides:
- Application User identity.
- Direct ownership validation.
- Inherited ownership rules.
- Cross-user access isolation.

C02 provides:
- Workspace ownership structure.
- Project ownership inheritance.
- Workspace and Project scope rules.

Integration requirements:
- Workspace owner must be a valid Application User.
- Project owner must resolve through Workspace.
- All Workspace and Project operations must respect C01.

## 15.2. C02 ↔ C03: Goal & Hierarchy

C03 owns:
- Goal entity.
- Goal hierarchy.
- Goal lifecycle.
- Goal operations.

C02 owns:
- Workspace scope.
- Project scope.
- Goal organizational classification.
- Project and Workspace consistency constraints.

Integration requirements:
- C03 must use C02 scope validation when creating or moving a Goal.
- C02 must not directly mutate Goal hierarchy.
- Goal scope changes must satisfy both C02 and C03 rules.
- Goal movement must preserve C01 ownership consistency.

## 15.3. C02 ↔ C04–C09

Dependent resources inherit or reference Workspace/Project context through their owning resources.

C02 requires:
- Milestones to remain within their Goal's Workspace scope.
- Actions to remain within valid Goal/Milestone ownership boundaries.
- Measurements to remain associated with valid Goal scope.
- Schedules to remain associated with valid Actions.
- Progress to respect the source Goal and Project context.
- Reviews to respect the ownership and scope of their source data.

C02 does not independently manage these dependent resources.

## 15.4. C02 ↔ B02: Workspace & Project Management

B02 implements:
- Workspace initialization.
- Workspace retrieval.
- Project creation.
- Project retrieval.
- Project updates.
- Project archival and deletion where approved.
- Workspace and Project application workflows.

C02 provides the business constraints those operations must satisfy.

## 15.5. C02 ↔ B03: Goal Management

B03 implements:
- Goal creation.
- Goal retrieval.
- Goal updates.
- Goal hierarchy operations.
- Goal scope movement.
- Goal archival and deletion.

C02 validates the Workspace and Project conditions.

## 15.6. C02 ↔ D01: Database & Persistence

C02 provides:
- Workspace and Project relationship requirements.
- Workspace uniqueness requirements.
- Project Workspace reference requirements.
- Goal scope consistency requirements.

D01 defines:
- Physical tables.
- Foreign keys.
- Unique constraints.
- Indexes.
- Migrations.
- Persistence mechanisms.

## 15.7. C02 ↔ D03: Shared Types & Contracts

Shared identifiers must be consistent across modules.

Expected conceptual types:
- `UserId`
- `WorkspaceId`
- `ProjectId`
- `GoalId`

The final shared type implementation belongs to D03.

# 16. ACCEPTANCE CRITERIA

### AC-001: Personal Workspace Creation

Given a valid Application User, the system can initialize exactly one Personal Workspace.

### AC-002: Personal Workspace Uniqueness

A User cannot create a second Personal Workspace in the MVP.

### AC-003: Workspace Ownership

A Workspace resolves to its correct owning Application User.

### AC-004: Project Creation

A Project can be created only within a valid Workspace.

### AC-005: Project Ownership Inheritance

A Project resolves to the owner of its Workspace.

### AC-006: Multiple Projects

A Workspace can contain multiple Projects.

### AC-007: Independent Goal Scope

A Goal can exist directly within a Workspace without a Project.

### AC-008: Project-owned Goal Scope

A Goal can belong to a Project within its Workspace.

### AC-009: Project Workspace Consistency

A Goal cannot reference a Project from a different Workspace.

### AC-010: Cross-User Isolation

A User cannot create or access a Project within another User's Workspace.

### AC-011: Scope Classification

The system can distinguish independent Workspace Goals from Project-owned Goals.

### AC-012: Goal Movement Validation

Goal scope movement validates the source and destination ownership and scope.

### AC-013: Goal Identity Preservation

An approved Goal movement does not replace the Goal with a new identity.

### AC-014: Dependent Resource Preservation

Scope movement does not silently delete or recreate related resources.

### AC-015: No Unapproved Cascade

Workspace or Project lifecycle operations do not automatically delete or archive dependent resources without approved rules.

### AC-016: Domain Separation

C02 does not independently create, update or delete Goal, Milestone, Action or Measurement entities.

### AC-017: Platform Independence

Workspace and Project business rules do not depend on a specific frontend or authentication provider.

# 17. TESTING REQUIREMENTS

## 17.1. Unit Tests

Required test groups:

- Workspace ownership validation.
- Workspace uniqueness validation.
- Project Workspace relationship validation.
- Project ownership resolution.
- Independent Goal scope validation.
- Project-owned Goal scope validation.
- Goal and Project Workspace consistency.
- Cross-user scope rejection.
- Invalid Workspace lifecycle operation handling.
- Invalid Project lifecycle operation handling.
- Goal scope movement validation.
- Invalid destination scope handling.

## 17.2. Integration Tests

Required scenarios:

1. Create a Personal Workspace for User A.
2. Attempt to create another Personal Workspace for User A.
3. Create multiple Projects inside User A's Workspace.
4. Resolve Project ownership through Workspace.
5. Create an independent Goal in User A's Workspace.
6. Create a Goal in Project A.
7. Attempt to associate a Goal with a Project belonging to User B.
8. Attempt to associate a Goal with a Project from a different Workspace.
9. Validate Goal movement from independent scope to Project scope.
10. Validate Goal movement from Project scope to independent scope.
11. Validate Goal movement between Projects.
12. Verify Goal identity preservation during an approved movement.
13. Verify related resources remain valid after an approved movement.
14. Verify Project operations respect Workspace ownership.

Tests involving unapproved lifecycle or movement behavior must remain blocked or use explicitly approved test assumptions.

## 17.3. Negative Tests

The implementation must test:

- Missing Workspace ID.
- Unknown Workspace.
- Invalid Workspace owner.
- Duplicate Personal Workspace.
- Missing Project ID.
- Unknown Project.
- Project without Workspace.
- Project ownership inconsistency.
- Goal with invalid Workspace.
- Goal with invalid Project.
- Goal and Project Workspace mismatch.
- Cross-user Project reference.
- Invalid Goal scope movement.
- Invalid lifecycle operation.
- Dependent resource conflict.

## 17.4. Test Independence

Domain unit tests must not require:
- Authentication Provider.
- Browser.
- Frontend application.
- Specific database vendor.
- Production data.

Persistence-level uniqueness and foreign key behavior must be verified separately when D01 is implemented.

# 18. IMPLEMENTATION BOUNDARIES

## 18.1. C02 Must Implement

- Workspace domain model.
- Project domain model.
- Workspace ownership constraints.
- Project ownership inheritance.
- Workspace–Project relationship rules.
- Independent and Project-owned Goal scope rules.
- Workspace and Project validation contracts.
- Goal scope validation contracts.
- Goal scope movement constraints.
- Domain error classifications.
- Unit tests for C02 rules.

## 18.2. C02 Must Not Implement

- Authentication.
- User Context resolution.
- Goal entity lifecycle.
- Goal hierarchy.
- Milestone management.
- Action management.
- Measurement management.
- Schedule management.
- Progress calculation.
- Review management.
- HTTP endpoints.
- UI state.
- Database migrations before D01 approval.
- Team collaboration.
- Project member roles.
- Automatic cascading deletion.
- Unapproved ownership transfer.

## 18.3. Dependency Boundaries

```text
                  C01
          Identity & Ownership
                   |
                   v
                  C02
        Workspace & Project Rules
                   |
                   v
                  C03
          Goal & Hierarchy Rules
                   |
           +-------+-------+
           |               |
           v               v
          C04             C05
       Milestone          Action
                           |
              +------------+-----------+
              |                        |
              v                        v
             C06                      C07
         Measurement              Planning
              |                        |
              +------------+-----------+
                           |
                           v
                          C08
                         Progress
                           |
                           v
                          C09
                          Review
```

This diagram represents conceptual relationships, not a strict runtime execution order.

# 19. IMPLEMENTATION TASK BREAKDOWN

| Task ID | Task | Deliverable |
|---|---|---|
| C02-IMP-001 | Define Workspace identity | Workspace domain model |
| C02-IMP-002 | Define Workspace ownership | Workspace ownership rules |
| C02-IMP-003 | Define Project identity | Project domain model |
| C02-IMP-004 | Define Project ownership inheritance | Project ownership resolver |
| C02-IMP-005 | Define Workspace–Project relationships | Relationship rules |
| C02-IMP-006 | Define Workspace uniqueness constraints | Workspace uniqueness policy |
| C02-IMP-007 | Define Goal scope classification | Goal scope model |
| C02-IMP-008 | Implement Workspace validation | Workspace validator |
| C02-IMP-009 | Implement Project validation | Project validator |
| C02-IMP-010 | Implement Project ownership resolution | Project owner resolver |
| C02-IMP-011 | Implement Goal scope validation | Goal scope validator |
| C02-IMP-012 | Implement scope movement validation contract | Movement validator |
| C02-IMP-013 | Define C02 domain errors | Error definitions |
| C02-IMP-014 | Implement unit tests | C02 unit test suite |
| C02-IMP-015 | Implement integration test fixtures | C02 integration test fixtures |
| C02-IMP-016 | Verify C01 integration | Ownership integration verification |
| C02-IMP-017 | Verify C03 integration | Goal scope integration verification |
| C02-IMP-018 | Complete implementation documentation | C02 implementation notes |

## 19.1. Recommended Implementation Sequence

### Phase 1 — Workspace Foundation
- C02-IMP-001
- C02-IMP-002
- C02-IMP-006
- C02-IMP-013

### Phase 2 — Project Foundation
- C02-IMP-003
- C02-IMP-004
- C02-IMP-005
- C02-IMP-008
- C02-IMP-009
- C02-IMP-010

### Phase 3 — Goal Scope
- C02-IMP-007
- C02-IMP-011
- C02-IMP-012

### Phase 4 — Verification
- C02-IMP-014
- C02-IMP-015
- C02-IMP-016
- C02-IMP-017
- C02-IMP-018

# 20. OPEN DECISIONS

The following decisions must remain visible and must not be silently converted into approved policies.

| Decision ID | Decision | Status | Impact |
|---|---|---|---|
| WORKSPACE-001 | Workspace name and profile requirements | OPEN | Workspace model |
| WORKSPACE-002 | Workspace status values | OPEN | Workspace lifecycle |
| WORKSPACE-003 | Workspace archival support | OPEN | Workspace lifecycle |
| WORKSPACE-004 | Workspace deletion and retention policy | OPEN | Dependent resources |
| PROJECT-001 | Project status values | OPEN | Project lifecycle |
| PROJECT-002 | Project completion criteria | OPEN | Project behavior |
| PROJECT-003 | Project archival and restoration | OPEN | Project lifecycle |
| PROJECT-004 | Project deletion behavior | OPEN | Related Goals and history |
| PROJECT-005 | Project name uniqueness scope | OPEN | Validation and database constraints |
| GOAL-SCOPE-001 | Exact Goal scope storage representation | OPEN | C03/D01 |
| GOAL-SCOPE-002 | Parent and Child Goal scope compatibility | OPEN | C03 |
| GOAL-SCOPE-003 | Moving a Parent Goal and descendants | OPEN | C03 |
| GOAL-SCOPE-004 | Moving a Child Goal independently | OPEN | C03 |
| GOAL-SCOPE-005 | Effects of movement on related resources | OPEN | C03–C09 |
| GOAL-SCOPE-006 | Goal movement support in MVP | OPEN | B03 |
| SCOPE-001 | Cross-module movement transaction strategy | OPEN | D01/Application Layer |

## 20.1. Core Implementation Policy

The following rules can be implemented without waiting for every OPEN decision:

- One Personal Workspace per User.
- A Project belongs to exactly one Workspace.
- A Workspace may have multiple Projects.
- Project ownership inherits from Workspace.
- Independent Goals can exist without Projects.
- Project-owned Goals must belong to the same Workspace as their Project.
- Cross-user Workspace and Project references are rejected.
- Ownership is validated through C01.
- No automatic cascade deletion or archival.
- No ownership transfer.
- Goal scope movement can have its validation contract implemented, but actual movement behavior must follow C03's approved policy.

Do not implement unsupported lifecycle transitions merely because the logical models include a status field.

# 21. IMPLEMENTATION HANDOFF CONTRACT

This section defines the boundary between Domain Design and the Code Factory.

## 21.1. Required Input Documents

The implementation agent must receive:

1. Master Blueprint v0.4.
2. B01 Authentication & User Context Specification.
3. B02 Workspace & Project Management Specification.
4. B03 Goal Management Specification.
5. C01 Identity & Ownership Implementation Specification.
6. C02 Workspace & Project Implementation Specification — this document.
7. Current Decision Log.
8. D03 Shared Types & Contracts, when available.
9. D04 Validation conventions, when available.
10. D06 Error Handling conventions, when available.

## 21.2. Implementation Instructions

The Code Factory must:

1. Inspect the existing repository before creating or modifying files.
2. Identify the existing language, framework, dependency versions and coding conventions.
3. Inspect existing C01 implementation or contracts.
4. Reuse existing `UserId`, `WorkspaceId`, `ProjectId` and related shared types where available.
5. Implement only C02 responsibilities.
6. Keep C02 independent of HTTP, UI, database vendors and Authentication Providers.
7. Respect C01 ownership rules.
8. Keep Goal entity and hierarchy behavior within C03.
9. Avoid creating database migrations before D01 design is approved.
10. Avoid inventing OPEN lifecycle behavior.
11. Avoid automatic cascading deletion or archival.
12. Add tests for every implemented core rule.
13. Document all blockers and specification conflicts.
14. Avoid modifying unrelated modules.
15. Report actual test execution results.

## 21.3. Expected Code Factory Output

The implementation agent must return:

1. Repository inspection summary.
2. Existing C01 integration status.
3. C02 implementation plan.
4. Files created or modified.
5. Workspace implementation.
6. Project implementation.
7. Goal scope validation implementation.
8. Unit tests.
9. Integration tests or documented blockers.
10. Test execution results.
11. Remaining OPEN decisions.
12. Known limitations.
13. C02 completion report.

The agent must not claim implementation is complete when tests have not been executed successfully.

# 22. DEFINITION OF DONE

C02 is considered `IMPLEMENTED & VERIFIED` when:

- Workspace domain model is implemented.
- One-Personal-Workspace-per-User constraint is enforced at the appropriate layers.
- Project domain model is implemented.
- Project ownership inheritance works correctly.
- Workspace–Project relationships are validated.
- Independent Goal scope is supported.
- Project-owned Goal scope is supported.
- Goal and Project Workspace consistency is validated.
- Cross-user scope references are rejected.
- Scope movement validation contracts are available.
- No unsupported cascading lifecycle behavior is implemented.
- C01 integration tests pass.
- C02 unit tests pass.
- Available C02 integration tests pass.
- Implementation boundaries are respected.
- Known limitations and OPEN decisions are documented.

---

# 23. FINAL STATUS

**Domain:** C02 — Workspace & Project Rules

**Specification Status:** CORE SPECIFICATION COMPLETE

**Implementation Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED

**Ready Core:**
- Personal Workspace ownership.
- Workspace uniqueness.
- Project ownership inheritance.
- Workspace–Project relationships.
- Independent Workspace Goal scope.
- Project-owned Goal scope.
- Goal scope consistency validation.
- Cross-user isolation.

**Not Ready for Final Implementation:**
- Workspace deletion and archival policy.
- Project completion and lifecycle policy.
- Project deletion behavior.
- Exact Goal scope storage representation.
- Parent–Child scope movement behavior.
- Full Goal movement execution and multi-module transaction behavior.

**Implementation Principle:**

C02 provides the organizational structure of FLOW-UP. Workspace defines the user's personal boundary, Project provides optional organization within that boundary, and Goal remains the business entity owned by C03.

No module may treat Project as an independent ownership boundary or bypass Workspace and C01 ownership validation.
# FLOW-UP — C03 GOAL & HIERARCHY RULES
## Domain Implementation Specification

**Document ID:** C03  
**Version:** 1.0  
**Layer:** C — Domain  
**Related Modules:** B01, B02, B03, B04, B05, B06, B08, B09  
**Related Domains:** C01, C02, C04, C05, C06, C08, C09  
**Infrastructure Dependencies:** D01–D08  
**Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED  
**Decision Status:** Core Goal model and hierarchy constraints specified; lifecycle, deletion, descendant movement and aggregation policies remain OPEN.

---

# 1. PURPOSE

C03 defines the business rules governing Goal management and Goal hierarchy in FLOW-UP.

It establishes:

- What a Goal represents.
- How a Goal is identified and owned.
- How Goals are organized within Workspace and Project scopes.
- How Parent–Child Goal relationships work.
- How Goal hierarchy is created, modified and validated.
- How Goal lifecycle operations are governed.
- How Goal target dates are managed.
- How Goal scope movement is validated.
- How Goal relationships with Milestones, Actions, Measurements, Progress and Reviews are maintained.

C03 provides the central Goal domain model used by the rest of FLOW-UP.

# 2. SCOPE

## 2.1. Included

- Goal business concept.
- Goal identity.
- Goal attributes.
- Goal ownership and scope.
- Independent Workspace Goals.
- Project-owned Goals.
- Parent–Child Goal relationships.
- Root Goal.
- Goal hierarchy.
- Hierarchy validation.
- Goal tree retrieval rules.
- Goal lifecycle constraints.
- Goal target date rules.
- Parent–Child lifecycle interaction.
- Goal scope movement constraints.
- Goal relationship integrity.
- Domain validation contracts.
- Goal-related invariants.

## 2.2. Excluded

- Workspace creation and management.
- Project creation and management.
- Milestone management.
- Action management.
- Measurement management.
- Schedule management.
- Progress calculation.
- Review management.
- AI-generated Goal proposals.
- Authentication and User Context.
- UI and navigation.
- HTTP endpoint implementation.
- Database vendor and ORM implementation.
- Project progress calculation.
- Automatic completion of parent Goals based on child Goals unless explicitly approved.

These responsibilities belong to their respective modules and Domains.

# 3. DOMAIN RESPONSIBILITIES

C03 owns the following business concepts:

| Concept | Responsibility |
|---|---|
| Goal | Core business entity representing an intended outcome |
| Goal Identity | Stable identifier for each Goal |
| Goal Attributes | Title, description, target date and scope references |
| Goal Scope | Independent Workspace or Project-owned Goal |
| Goal Hierarchy | Parent–Child relationships |
| Root Goal | Goal without a Parent Goal |
| Goal Tree | Hierarchical representation of related Goals |
| Hierarchy Integrity | Prevention of invalid relationships and cycles |
| Goal Lifecycle | Goal status and lifecycle behavior |
| Goal Target | Target date and its modification rules |
| Goal Movement | Moving Goal within or between valid scopes |

C03 is the authoritative owner of Goal and Goal Hierarchy behavior.

# 4. GOAL DOMAIN MODEL

## 4.1. Goal Definition

A Goal represents an outcome that a user intends to achieve.

A Goal may:

- Exist independently inside a Personal Workspace.
- Belong to a Project.
- Have a Parent Goal.
- Contain Child Goals.
- Have zero or more Milestones.
- Have related Actions.
- Have one or more Measurement definitions.
- Be scheduled indirectly through related Actions.
- Have Progress information.
- Be referenced by Reviews.

A Goal represents an intended outcome, not an individual execution task.

## 4.2. Goal Identity

Every Goal must have a stable and unique identifier.

Goal identity must be independent of:

- Goal title.
- Goal description.
- Target date.
- Project name.
- Workspace name.
- Parent Goal.
- Frontend component identifiers.

Changing Goal attributes or permitted relationships must not silently replace its identity.

## 4.3. Logical Goal Model

The following is a logical model, not a final database schema.

| Attribute | Type | Requirement | Description |
|---|---|---|---|
| id | GoalId | Required | Stable Goal identifier |
| workspace_id | WorkspaceId | Required | Workspace scope |
| project_id | ProjectId or null | Optional | Project scope |
| parent_goal_id | GoalId or null | Optional | Parent Goal reference |
| title | String | Required | Goal title |
| description | String or null | Optional | Goal description |
| target_date | Date or null | Optional | Intended target date |
| status | GoalStatus | OPEN | Goal lifecycle status |
| created_at | Timestamp | Required | Creation timestamp |
| updated_at | Timestamp | Required | Last update timestamp |
| archived_at | Timestamp or null | OPEN | Archival timestamp, if supported |

The final status values, database representation and additional attributes must follow approved decisions and D01 design.

## 4.4. Goal Attributes

### Goal Title

- Required.
- Must not be empty.
- Must satisfy the approved length constraints.
- Must be suitable for identifying the Goal.

Exact minimum and maximum lengths remain implementation configuration decisions until approved.

### Goal Description

- Optional.
- Provides additional context about the intended outcome.
- Must not be used as a substitute for Goal identity.
- May be updated without changing Goal identity.

### Goal Target Date

- Optional.
- Represents the intended date by which the Goal should be achieved.
- Must be a valid date value.
- Must not be confused with Action Schedule or actual completion time.

### Goal Status

- Represents the current lifecycle state of the Goal.
- Must follow the approved Goal lifecycle model.
- Must not be independently modified by UI progress calculations.

# 5. GOAL SCOPE MODEL

## 5.1. Supported Goal Scopes

The MVP supports two conceptual Goal scopes.

### A. Independent Workspace Goal

A Goal that belongs directly to a Workspace and is not associated with a Project.

```text id="r0g2f1"
User
  |
  v
Workspace
  |
  v
Independent Goal
```

### B. Project-owned Goal

A Goal that belongs to a Project inside a Workspace.

```text id="f1h3c8"
User
  |
  v
Workspace
  |
  v
Project
  |
  v
Goal
```

## 5.2. Scope Representation

Conceptual fields:

- `workspace_id`
- `project_id`

A null `project_id` represents an independent Workspace Goal.

A valid `project_id` represents a Project-owned Goal.

The final storage model must be coordinated with C02 and D01.

## 5.3. Scope Invariants

- Every Goal must belong to a valid Workspace scope.
- A Project-owned Goal must reference a valid Project.
- The Project must belong to the same Workspace as the Goal.
- An independent Goal must not have an invalid Project reference.
- Goal ownership must remain consistent with C01.
- Goal hierarchy changes must not create invalid scope relationships.

## 5.4. Goal Scope and Hierarchy

The relationship between Parent and Child Goal scopes requires an explicit policy.

Possible policies include:

- Parent and Child must share the same Workspace and Project scope.
- Parent and Child must share the same Workspace but may belong to different Projects.
- Child Goals may inherit the Parent Goal's scope.
- Child Goals may have independently assigned scope.

No alternative is approved by this document.

Until a policy is approved, the implementation must enforce the confirmed Workspace ownership boundary and must not assume unrestricted cross-Project hierarchy.

# 6. GOAL HIERARCHY MODEL

## 6.1. Hierarchy Definition

Goal hierarchy allows a Goal to contain other Goals representing subordinate outcomes.

A Goal may have:

- Zero or one Parent Goal.
- Zero or more Child Goals.

A Goal without a Parent Goal is a Root Goal.

A Goal with a Parent Goal is a Child Goal.

## 6.2. Logical Relationship

```text id="r8m2z4"
Root Goal A
    |
    +-- Child Goal A1
    |       |
    |       +-- Child Goal A1.1
    |       |
    |       +-- Child Goal A1.2
    |
    +-- Child Goal A2
            |
            +-- Child Goal A2.1
```

The hierarchy supports multiple levels conceptually.

Maximum hierarchy depth remains OPEN.

## 6.3. Parent–Child Relationship

Each Goal may reference one Parent Goal through `parent_goal_id`.

A Parent Goal may have multiple Child Goals.

A Child Goal must reference an existing Parent Goal when the relationship is present.

## 6.4. Root Goal

A Root Goal is a Goal with no Parent Goal.

A Root Goal may be:

- An independent Workspace Goal.
- A Project-owned Goal.

Root Goal classification is independent of Project scope.

## 6.5. Goal Tree

A Goal Tree is the hierarchical representation of a Root Goal and its descendants.

The tree may include:

- Root Goal.
- Direct Child Goals.
- Nested Child Goals.
- Hierarchy depth.
- Parent references.
- Child collections.

C03 defines hierarchy semantics.

B03 implements Goal tree retrieval operations.

# 7. GOAL RELATIONSHIP MODEL

## 7.1. Relationship Matrix

| Relationship | Cardinality | Owner Domain | Status |
|---|---|---|---|
| Workspace–Goal | One-to-many | C02/C03 | Core scope |
| Project–Goal | One-to-many | C02/C03 | Core scope |
| Goal–Parent Goal | Many-to-one, optional | C03 | Core scope |
| Goal–Child Goal | One-to-many | C03 | Core scope |
| Goal–Milestone | One-to-many | C04 | Approved baseline |
| Goal–Action | To be confirmed | C05 | OPEN |
| Goal–Measurement Definition | One-to-many | C06 | Approved baseline |
| Goal–Measurement Record | Indirect through Measurement | C06 | Core relationship |
| Goal–Schedule | Indirect through Action | C07 | Core relationship |
| Goal–Progress | Derived | C08 | Core relationship |
| Goal–Review | To be confirmed | C09 | OPEN |

## 7.2. Workspace Relationship

Every Goal must resolve to a valid Workspace.

Workspace scope rules are defined by C02.

C03 must not independently redefine Workspace ownership.

## 7.3. Project Relationship

A Goal may be independent or Project-owned.

Project relationship validity must be checked through C02.

## 7.4. Milestone Relationship

A Goal may have zero or more Milestones.

Each Milestone belongs to one Goal.

C04 owns Milestone behavior and lifecycle.

C03 must not manage Milestone entities directly.

## 7.5. Action Relationship

Actions represent concrete units of work associated with Goals and/or Milestones under the approved C05 relationship model.

C03 must not independently determine Action cardinality.

## 7.6. Measurement Relationship

A Goal may have multiple Measurement definitions.

C06 owns Measurement definitions and recorded values.

C03 provides the Goal identity and relationship context.

## 7.7. Schedule Relationship

A Goal is related to Schedule data through its Actions.

C03 does not own Schedule.

C07 owns Planning and Schedule relationships.

## 7.8. Progress Relationship

Progress is derived from approved Goal-related source data.

C08 owns authoritative Progress calculations.

C03 must not calculate or store authoritative Progress as part of Goal lifecycle logic.

## 7.9. Review Relationship

Reviews may reference Goals and related execution data.

C09 owns Review behavior and scope.

C03 provides Goal identity and retrieval context.

# 8. HIERARCHY INVARIANTS

The following invariants must always be respected.

**GOAL-H-001 — No Self-Parenting**

A Goal cannot reference itself as its Parent Goal.

**GOAL-H-002 — No Circular Hierarchy**

A Goal hierarchy must not contain cycles.

**GOAL-H-003 — Valid Parent**

A Parent Goal must exist.

**GOAL-H-004 — Single Parent**

A Goal may have at most one Parent Goal.

**GOAL-H-005 — Valid Child Relationship**

A Child Goal must belong to a valid hierarchy relationship.

**GOAL-H-006 — Ownership Consistency**

Parent and Child Goals must satisfy C01 ownership rules.

**GOAL-H-007 — Workspace Consistency**

Parent and Child Goals must satisfy approved Workspace scope rules.

**GOAL-H-008 — Project Scope Consistency**

Parent and Child Goals must satisfy the approved Project scope policy.

**GOAL-H-009 — Identity Preservation**

Hierarchy changes must not silently replace Goal identities.

**GOAL-H-010 — Relationship Integrity**

Hierarchy changes must not leave invalid Parent or Child references.

**GOAL-H-011 — No Orphaned References**

Deleting or changing a Parent relationship must follow approved descendant behavior.

**GOAL-H-012 — Hierarchy Depth Policy**

Any hierarchy depth restriction must be explicitly configured and approved.

# 9. HIERARCHY OPERATIONS

## 9.1. Create Child Goal

A Child Goal may be created under a valid Parent Goal.

Preconditions:

- Parent Goal exists.
- Caller has access to the Parent Goal.
- New Goal satisfies required Goal fields.
- New Goal satisfies Workspace ownership constraints.
- New Goal satisfies approved Project scope rules.
- New relationship does not violate hierarchy invariants.

C03 owns the hierarchy relationship rules.

B03 implements the creation operation.

## 9.2. Change Parent Goal

Changing the Parent Goal modifies the hierarchy structure.

The operation must:

- Validate the target Goal.
- Validate the new Parent Goal.
- Prevent self-parenting.
- Prevent circular relationships.
- Validate Workspace and Project scope.
- Preserve Goal identity.
- Preserve valid related resources.

## 9.3. Remove Parent Relationship

Removing a Parent relationship converts a Child Goal into a Root Goal.

The operation must:

- Preserve the Goal identity.
- Preserve the Goal's own descendants.
- Validate the resulting Goal scope.
- Avoid invalid ownership relationships.

Whether removing the Parent relationship is always allowed remains subject to the approved scope policy.

## 9.4. Move Goal Within Hierarchy

Moving a Goal within a hierarchy means changing its Parent Goal while preserving its identity.

The operation must:

- Validate the source hierarchy.
- Validate the destination hierarchy.
- Prevent circular references.
- Validate ownership.
- Validate scope compatibility.
- Preserve descendant relationships according to the approved movement policy.

## 9.5. Retrieve Goal Tree

The Goal Tree operation retrieves a Root Goal and its descendants.

The result must:

- Preserve hierarchy structure.
- Represent Parent–Child relationships correctly.
- Avoid duplicate Goal entries.
- Respect ownership and access boundaries.
- Avoid infinite traversal caused by invalid cycles.
- Provide sufficient information for hierarchy presentation.

## 9.6. Retrieve Goal Ancestors

The operation retrieves the Parent Goal chain of a specified Goal.

Expected behavior:

- Begin with the specified Goal.
- Traverse Parent relationships.
- Stop at the Root Goal.
- Detect invalid cycles.
- Respect ownership boundaries.

## 9.7. Retrieve Goal Descendants

The operation retrieves all descendants of a specified Goal.

Expected behavior:

- Include direct descendants.
- Include nested descendants.
- Preserve hierarchy relationships.
- Respect the approved depth policy.
- Prevent duplicate results.
- Detect invalid hierarchy data.

## 9.8. Validate Hierarchy Changes

Every hierarchy-changing operation must validate:

1. Goal existence.
2. Parent Goal existence.
3. Ownership consistency.
4. Workspace scope.
5. Project scope policy.
6. Self-parenting.
7. Circular relationships.
8. Hierarchy depth policy, if approved.
9. Lifecycle restrictions.
10. Related resource integrity.

# 10. GOAL LIFECYCLE

## 10.1. Lifecycle Definition

Goal lifecycle describes the state and permitted transitions of a Goal.

C03 owns Goal lifecycle semantics.

The exact lifecycle model must be explicitly approved before final implementation.

## 10.2. Proposed Status Model

The following statuses are carried forward from the B03 design as proposals, not approved decisions.

| Status | Description | Decision |
|---|---|---|
| ACTIVE | Goal is currently being pursued | PROPOSED |
| COMPLETED | Goal has been achieved | PROPOSED |
| ARCHIVED | Goal is no longer actively managed but retained | PROPOSED |
| DELETED | Goal is deleted or marked for deletion | OPEN |

These values must not be treated as an approved enum until GOAL-001 is resolved.

## 10.3. Goal Creation

A Goal may be created when:

- Required fields are valid.
- Workspace scope is valid.
- Optional Project scope is valid.
- Optional Parent Goal is valid.
- Ownership is valid.
- Initial lifecycle state follows the approved lifecycle model.

## 10.4. Goal Activation

Goal activation behavior must follow the approved lifecycle.

The system must not activate an invalid or inaccessible Goal.

## 10.5. Goal Completion

Completing a Goal represents an explicit lifecycle operation.

Goal completion must not automatically imply:

- All Child Goals are completed.
- All Milestones are completed.
- All Actions are completed.
- All Measurements reached their targets.
- Project is completed.

Automatic completion conditions remain OPEN.

## 10.6. Goal Reopening

Reopening a completed Goal changes its lifecycle state.

Reopening behavior remains OPEN.

The implementation must not assume that every completed Goal can be reopened.

## 10.7. Goal Archival

Archival is distinct from completion and deletion.

Archiving a Goal must not silently:

- Delete the Goal.
- Delete its descendants.
- Delete Milestones.
- Delete Actions.
- Delete Measurement history.
- Delete Schedule history.
- Delete Progress history.
- Delete Reviews.

Whether archival propagates to descendants remains OPEN.

## 10.8. Goal Restoration

Restoration behavior must follow the approved archival model.

The system must ensure restored Goals have valid relationships and scope.

## 10.9. Goal Deletion

Goal deletion behavior remains OPEN.

The implementation must not automatically:

- Cascade-delete descendants.
- Cascade-delete Milestones.
- Cascade-delete Actions.
- Delete Measurement records.
- Delete Schedule history.
- Delete Progress history.
- Delete Reviews.

Deletion must be designed together with dependent Domain modules and D01.

# 11. GOAL TARGET RULES

## 11.1. Target Date Definition

A Goal may have an optional target date.

The target date represents the intended date for achieving the Goal.

## 11.2. Target Date Validation

- Target date must be a valid date.
- Target date may be absent.
- Target date must not be confused with creation time.
- Target date must not be confused with actual completion time.
- Target date must not be interpreted as a Schedule entry.

## 11.3. Target Date Modification

A Goal target date may be modified according to the approved Goal update rules.

The modification must:

- Preserve Goal identity.
- Update the Goal's modification timestamp.
- Not automatically modify related Action Schedules.
- Not automatically change Goal lifecycle status.
- Not automatically recalculate or persist Progress without C08 rules.

## 11.4. Target Date Expiration

A target date passing does not automatically mean:

- Goal is completed.
- Goal is failed.
- Goal is archived.
- Goal must be deleted.

The behavior of overdue Goals remains an application and product policy decision.

## 11.5. Target Date and Time Zone

Goal target date is a calendar-date concept.

It must remain distinct from timestamp-based Schedule and execution data.

The final time-zone handling policy must be coordinated with C07 and D01.

# 12. PARENT–CHILD LIFECYCLE INTERACTION

## 12.1. Independent Lifecycle

Parent and Child Goals are separate Goal entities.

Their lifecycle behavior must be explicitly defined.

No automatic lifecycle propagation is assumed.

## 12.2. Parent Completion

Completing a Parent Goal must not automatically complete Child Goals unless explicitly approved.

## 12.3. Child Completion

Completing a Child Goal must not automatically complete its Parent Goal.

## 12.4. Parent Archival

The effect of archiving a Parent Goal on its descendants remains OPEN.

## 12.5. Child Archival

A Child Goal may have its own archival behavior subject to approved lifecycle rules.

Whether this affects Parent Goal behavior remains OPEN.

## 12.6. Parent Deletion

Parent deletion behavior must explicitly define:

- Whether Child Goals are deleted.
- Whether Child Goals are promoted to Root Goals.
- Whether Parent deletion is blocked while descendants exist.
- Whether historical relationships are retained.

No behavior is approved by this document.

## 12.7. Child Deletion

Child deletion behavior must define:

- Whether its descendants are deleted.
- Whether descendants are promoted.
- Whether deletion is blocked.
- Whether historical hierarchy references are preserved.

No behavior is approved by this document.

## 12.8. Progress Aggregation

Parent and Child Goal Progress aggregation belongs to C08.

C03 provides hierarchy information.

C03 must not calculate parent progress from child progress.

# 13. GOAL SCOPE MOVEMENT

## 13.1. Purpose

Goal scope movement changes the Workspace or Project context of an existing Goal.

C03 owns the Goal movement operation.

C02 owns Workspace and Project scope validation.

C01 owns ownership validation.

## 13.2. Supported Conceptual Movement Types

1. Independent Workspace Goal → Project-owned Goal.
2. Project-owned Goal → Independent Workspace Goal.
3. Project A Goal → Project B Goal.
4. Goal movement within its existing hierarchy.
5. Parent Goal movement.
6. Child Goal movement.

Actual MVP support and detailed movement behavior remain subject to the approved decisions.

## 13.3. Movement Preconditions

Before moving a Goal, validate:

- Source Goal exists.
- Caller owns the source Workspace.
- Destination Workspace exists.
- Destination Project exists when required.
- Caller owns the destination Workspace.
- Destination Project belongs to the destination Workspace.
- Parent–Child hierarchy remains valid.
- No circular relationship is introduced.
- Related resources remain valid.
- No prohibited lifecycle state blocks movement.

## 13.4. Goal Identity Preservation

A permitted movement must preserve the Goal ID.

Movement must not be implemented as:

1. Create a replacement Goal.
2. Copy existing Goal attributes.
3. Delete the original Goal.

A movement is a relationship or scope change to the existing Goal.

## 13.5. Descendant Movement

Whether moving a Parent Goal automatically moves its descendants remains OPEN.

Possible behaviors include:

- Move the entire subtree.
- Move only the selected Goal.
- Reject movement when descendants exist.
- Require an explicit movement strategy.

No behavior is approved by this specification.

## 13.6. Related Resource Preservation

A Goal may have:

- Child Goals.
- Milestones.
- Actions.
- Measurements.
- Measurement records.
- Schedules associated with Actions.
- Progress information.
- Reviews.

A permitted movement must not silently delete or recreate related resources.

Each affected relationship must remain valid after movement.

## 13.7. Movement Validation

The operation must validate:

1. Source Goal ownership.
2. Source Goal scope.
3. Destination Workspace ownership.
4. Destination Project validity.
5. Parent–Child compatibility.
6. Circular hierarchy prevention.
7. Dependent resource integrity.
8. Goal lifecycle restrictions.
9. Scope consistency.
10. Transaction or recovery requirements.

## 13.8. Movement Atomicity

A failed movement must not leave a partially modified Goal hierarchy.

The application implementation must coordinate:

- C01 ownership validation.
- C02 Workspace and Project validation.
- C03 hierarchy validation.
- Related Domain relationship validation.
- D01 persistence transaction requirements.

The exact multi-module transaction strategy remains OPEN.

# 14. BUSINESS INVARIANTS

The following invariants define the core C03 behavior.

**GOAL-001 — Stable Identity**

Every Goal must have a stable unique identifier.

**GOAL-002 — Valid Workspace**

Every Goal must belong to a valid Workspace.

**GOAL-003 — Valid Project Scope**

A Project-owned Goal must reference a valid Project within the same Workspace.

**GOAL-004 — Optional Project**

A Goal may exist without a Project.

**GOAL-005 — Optional Parent**

A Goal may exist without a Parent Goal.

**GOAL-006 — Valid Parent**

A Parent Goal must exist.

**GOAL-007 — Single Parent**

A Goal may have at most one Parent Goal.

**GOAL-008 — No Self-Parenting**

A Goal cannot be its own Parent.

**GOAL-009 — No Circular Hierarchy**

The hierarchy must not contain cycles.

**GOAL-010 — Ownership Consistency**

Goal relationships must satisfy C01 ownership rules.

**GOAL-011 — Scope Consistency**

Goal hierarchy and Project relationships must satisfy C02 scope rules.

**GOAL-012 — Stable Identity During Movement**

Permitted Goal movement must preserve Goal identity.

**GOAL-013 — Valid Lifecycle Transitions**

Goal lifecycle transitions must follow the approved status model.

**GOAL-014 — No Automatic Parent Completion**

Parent completion must not automatically complete Child Goals without approval.

**GOAL-015 — No Automatic Child Completion**

Child completion must not automatically complete Parent Goals without approval.

**GOAL-016 — No Unapproved Cascade**

Goal archival or deletion must not automatically propagate to descendants or related entities without approval.

**GOAL-017 — Target Date Separation**

Target date must remain distinct from actual completion timestamps and Action Schedules.

**GOAL-018 — No Independent Progress Calculation**

C03 must not calculate authoritative Progress.

# 15. VALIDATION RULES

## 15.1. Goal Identity Validation

**GV-001 — Goal ID Required**

A persisted Goal must have a valid identifier.

**GV-002 — Goal ID Unique**

A Goal ID must uniquely identify one Goal.

## 15.2. Goal Attribute Validation

**GV-003 — Goal Title Required**

Goal title must not be empty.

**GV-004 — Goal Title Valid**

Goal title must satisfy approved length and input constraints.

**GV-005 — Goal Description Valid**

Description must satisfy approved content and length constraints.

**GV-006 — Goal Target Date Valid**

Target date must be a valid date value when provided.

## 15.3. Goal Scope Validation

**GV-007 — Workspace Exists**

Workspace must exist.

**GV-008 — Workspace Access Valid**

Caller must own or be authorized to access Workspace.

**GV-009 — Project Exists**

Project must exist when Project scope is used.

**GV-010 — Project Workspace Match**

Goal and Project must belong to the same Workspace.

**GV-011 — Independent Goal Scope Valid**

An independent Goal must not reference an invalid Project.

## 15.4. Hierarchy Validation

**GV-012 — Parent Exists**

Parent Goal must exist.

**GV-013 — Parent Not Self**

Goal cannot be its own Parent.

**GV-014 — No Circular Relationship**

Parent reassignment must not create a cycle.

**GV-015 — Parent Ownership Valid**

Parent and Child must satisfy C01 ownership rules.

**GV-016 — Parent Scope Valid**

Parent and Child must satisfy the approved C02/C03 scope policy.

**GV-017 — Hierarchy Depth Valid**

Hierarchy depth must satisfy the approved depth policy, if one exists.

## 15.5. Lifecycle Validation

**GV-018 — Status Valid**

Goal status must belong to the approved status model.

**GV-019 — Status Transition Valid**

Requested lifecycle transition must be allowed.

**GV-020 — Lifecycle Operation Valid**

Archive, restore, delete, complete and reopen operations must follow approved rules.

## 15.6. Movement Validation

**GV-021 — Source Goal Valid**

Source Goal must exist and be accessible.

**GV-022 — Destination Scope Valid**

Destination Workspace and optional Project must be valid.

**GV-023 — Destination Ownership Valid**

Caller must own or be authorized to access destination scope.

**GV-024 — Hierarchy Movement Valid**

Movement must not create invalid Parent–Child relationships.

**GV-025 — Dependent Relationships Valid**

Related resources must remain valid after movement.

**GV-026 — Movement Atomicity**

Failed movement must not leave partially modified relationships.

# 16. DOMAIN OPERATIONS AND CONTRACTS

C03 defines the business-level operations and their expected inputs and outputs.

These contracts are logical and language-independent.

## 16.1. Create Goal

**Operation:** `createGoal`

Input:
- Caller User ID.
- Goal title.
- Optional description.
- Workspace ID.
- Optional Project ID.
- Optional Parent Goal ID.
- Optional target date.

Output:
- Created Goal.
- Validated scope.
- Validated hierarchy relationship.

Validation:
- C01 ownership.
- C02 Workspace/Project scope.
- Goal attribute validity.
- Parent Goal validity.
- Hierarchy invariants.

## 16.2. Update Goal

**Operation:** `updateGoal`

Input:
- Caller User ID.
- Goal ID.
- Approved mutable attributes.

Output:
- Updated Goal.

Validation:
- Ownership.
- Field constraints.
- Lifecycle restrictions.
- Target date validity.

Owner ID, Goal ID and hierarchy relationships must not be changed through an unrestricted attribute update.

## 16.3. Retrieve Goal

**Operation:** `getGoal`

Input:
- Caller User ID.
- Goal ID.

Output:
- Goal information.
- Validated ownership context.

## 16.4. Retrieve Goals by Scope

**Operation:** `getGoalsByScope`

Input:
- Caller User ID.
- Workspace ID.
- Optional Project ID.
- Optional Parent Goal ID.
- Optional status filter.

Output:
- Matching authorized Goals.

The result must not expose Goals from another User's Workspace.

## 16.5. Create Child Goal

**Operation:** `createChildGoal`

Input:
- Caller User ID.
- Parent Goal ID.
- Child Goal attributes.
- Approved scope information.

Output:
- Created Child Goal.
- Updated hierarchy relationship.

## 16.6. Change Parent Goal

**Operation:** `changeParentGoal`

Input:
- Caller User ID.
- Goal ID.
- New Parent Goal ID.

Output:
- Updated hierarchy relationship.

Validation:
- No self-parenting.
- No circular hierarchy.
- Ownership consistency.
- Scope consistency.
- Lifecycle restrictions.

## 16.7. Remove Parent Relationship

**Operation:** `removeParentGoal`

Input:
- Caller User ID.
- Goal ID.

Output:
- Goal converted to Root Goal, if permitted.

Validation:
- Goal ownership.
- Current hierarchy validity.
- Scope validity.
- Lifecycle restrictions.

## 16.8. Retrieve Goal Tree

**Operation:** `getGoalTree`

Input:
- Caller User ID.
- Root Goal ID.
- Optional depth limit, if approved.

Output:
- Hierarchical Goal Tree.

## 16.9. Retrieve Goal Ancestors

**Operation:** `getGoalAncestors`

Input:
- Caller User ID.
- Goal ID.

Output:
- Ordered Parent Goal chain.

## 16.10. Retrieve Goal Descendants

**Operation:** `getGoalDescendants`

Input:
- Caller User ID.
- Goal ID.
- Optional depth limit, if approved.

Output:
- Descendant Goals.

## 16.11. Validate Hierarchy

**Operation:** `validateGoalHierarchy`

Input:
- Goal ID.
- Proposed Parent Goal ID.
- Hierarchy context.

Output:
- Valid or invalid.
- Validation result.
- Blocking conditions.

## 16.12. Move Goal Scope

**Operation:** `moveGoalScope`

Input:
- Caller User ID.
- Goal ID.
- Destination Workspace ID.
- Optional destination Project ID.
- Approved movement strategy.

Output:
- Updated Goal scope.
- Movement validation result.

This operation must not be fully enabled until the relevant movement decisions are approved.

## 16.13. Goal Lifecycle Operations

Logical operations:

- `completeGoal`
- `reopenGoal`
- `archiveGoal`
- `restoreGoal`
- `deleteGoal`

These operations must remain blocked until the corresponding lifecycle decisions are approved.

# 17. ERROR MODEL

| Error Code | Meaning |
|---|---|
| GOAL_NOT_FOUND | Goal does not exist |
| GOAL_ACCESS_DENIED | Caller cannot access Goal |
| GOAL_INVALID_ID | Goal identifier is invalid |
| GOAL_INVALID_TITLE | Goal title is invalid |
| GOAL_INVALID_DESCRIPTION | Goal description is invalid |
| GOAL_INVALID_TARGET_DATE | Target date is invalid |
| GOAL_WORKSPACE_NOT_FOUND | Workspace does not exist |
| GOAL_PROJECT_NOT_FOUND | Project does not exist |
| GOAL_SCOPE_INVALID | Goal scope is invalid |
| GOAL_SCOPE_MISMATCH | Goal scope relationships are inconsistent |
| GOAL_PARENT_NOT_FOUND | Parent Goal does not exist |
| GOAL_PARENT_INVALID | Parent Goal relationship is invalid |
| GOAL_SELF_PARENTING | Goal cannot be its own Parent |
| GOAL_HIERARCHY_CYCLE | Hierarchy contains or would create a cycle |
| GOAL_HIERARCHY_DEPTH_EXCEEDED | Approved hierarchy depth is exceeded |
| GOAL_HIERARCHY_INVALID | Goal hierarchy is invalid |
| GOAL_STATUS_INVALID | Goal status is invalid |
| GOAL_STATUS_TRANSITION_INVALID | Requested lifecycle transition is not allowed |
| GOAL_ALREADY_COMPLETED | Goal is already completed |
| GOAL_NOT_COMPLETED | Goal cannot be reopened from its current state |
| GOAL_ARCHIVE_INVALID | Archival operation is invalid |
| GOAL_RESTORE_INVALID | Restoration operation is invalid |
| GOAL_DELETE_BLOCKED | Deletion is blocked by unresolved dependencies |
| GOAL_SCOPE_MOVEMENT_INVALID | Scope movement is invalid |
| GOAL_SCOPE_MOVEMENT_BLOCKED | Scope movement is blocked |
| GOAL_DEPENDENCY_CONFLICT | Related resources prevent the requested operation |
| GOAL_OWNERSHIP_INVALID | Ownership validation failed |
| GOAL_PERSISTENCE_ERROR | Persistence operation failed |

Error mapping:

- C03 produces Domain error classifications.
- Application Layer maps them to API responses.
- D06 defines shared error response conventions.
- Error messages must not expose protected resource information.

# 18. CROSS-DOMAIN INTEGRATION CONTRACTS

## 18.1. C03 ↔ C01: Identity & Ownership

C01 provides:
- Application User identity.
- Direct ownership validation.
- Inherited ownership rules.
- Cross-user access isolation.

C03 provides:
- Goal ownership context.
- Goal relationship references.
- Hierarchy ownership constraints.

Integration requirements:
- Every Goal must resolve to a valid owner.
- Parent and Child Goals must satisfy ownership consistency.
- Goal movement must preserve ownership.
- Unauthorized Goal references must be rejected.

## 18.2. C03 ↔ C02: Workspace & Project

C02 provides:
- Workspace validation.
- Project validation.
- Goal scope classification.
- Project and Workspace consistency rules.

C03 provides:
- Goal entity.
- Goal scope references.
- Goal hierarchy.
- Goal movement operation.

Integration requirements:
- Goal creation must validate scope through C02.
- Goal movement must validate source and destination scopes through C02.
- C03 must not duplicate Workspace or Project ownership rules.
- Hierarchy changes must satisfy the approved scope compatibility policy.

## 18.3. C03 ↔ C04: Milestone

C04 owns Milestone.

C03 provides:
- Goal identity.
- Goal scope.
- Goal lifecycle information.

Integration requirements:
- Milestones must reference valid Goals.
- Goal lifecycle operations must respect approved Milestone dependency behavior.
- Goal deletion must not silently remove Milestones.

## 18.4. C03 ↔ C05: Action

C05 owns Action and execution data.

C03 provides:
- Goal identity.
- Goal ownership.
- Goal hierarchy context.

Integration requirements:
- Actions must reference valid Goals according to C05 relationship rules.
- Goal scope changes must preserve Action relationship validity.
- Goal lifecycle behavior must respect Action dependencies.

## 18.5. C03 ↔ C06: Measurement

C06 owns Measurement definitions and records.

C03 provides:
- Goal identity.
- Goal scope.
- Goal lifecycle context.

Integration requirements:
- Measurements must reference valid Goals.
- Goal movement must preserve Measurement ownership and relationships.
- Goal deletion must follow approved Measurement history rules.

## 18.6. C03 ↔ C08: Progress

C08 owns authoritative Progress calculations.

C03 provides:
- Goal information.
- Parent–Child hierarchy.
- Goal lifecycle context.

Integration requirements:
- C08 may use Goal hierarchy for aggregation.
- C03 must not calculate Goal Progress.
- Goal lifecycle changes must be communicated through normal application operations.
- C08 must determine the effect of hierarchy changes on Progress.

## 18.7. C03 ↔ C09: Review

C09 owns Review.

C03 provides:
- Goal identity.
- Goal scope.
- Goal hierarchy references.

Integration requirements:
- Reviews must reference valid Goals.
- Goal movement must not silently invalidate historical Reviews.
- Goal deletion must follow approved Review history rules.

## 18.8. C03 ↔ B03: Goal Management

B03 implements Goal application operations.

C03 provides:
- Goal business model.
- Goal lifecycle rules.
- Hierarchy rules.
- Scope constraints.
- Validation requirements.

B03 must not independently invent business rules that conflict with C03.

## 18.9. C03 ↔ B10: AI Orchestration

B10 may generate Goal proposals.

C03 requires:
- AI-generated Goal data to satisfy Goal validation.
- AI-generated hierarchy to satisfy hierarchy invariants.
- AI-generated scope references to pass C02 validation.
- AI-generated proposals to remain unapproved until explicit user approval.

AI output must not directly bypass C03 operations.

# 19. ACCEPTANCE CRITERIA

### AC-001: Create Goal

A valid Goal can be created with required attributes and valid scope.

### AC-002: Stable Goal Identity

Goal ID remains stable during permitted updates.

### AC-003: Independent Goal

A Goal can exist without a Project.

### AC-004: Project-owned Goal

A Goal can belong to a valid Project within its Workspace.

### AC-005: Create Child Goal

A valid Child Goal can be created under an authorized Parent Goal.

### AC-006: Root Goal

A Goal without a Parent Goal is represented as a Root Goal.

### AC-007: Single Parent

A Goal cannot have multiple Parent Goals.

### AC-008: No Self-Parenting

A Goal cannot reference itself as Parent.

### AC-009: Circular Hierarchy Prevention

A hierarchy operation that creates a cycle must be rejected.

### AC-010: Parent Change

A valid Parent relationship can be changed without replacing Goal identity.

### AC-011: Remove Parent Relationship

A permitted Parent relationship removal preserves the Goal identity and its valid descendants.

### AC-012: Goal Tree Retrieval

The system can retrieve a valid Goal Tree.

### AC-013: Ancestor Retrieval

The system can retrieve the Parent Goal chain.

### AC-014: Descendant Retrieval

The system can retrieve all valid descendants.

### AC-015: Workspace Scope Validation

Goal scope must resolve to a valid Workspace.

### AC-016: Project Scope Validation

Project-owned Goal must reference a Project within the same Workspace.

### AC-017: Ownership Isolation

Users cannot access or modify Goals owned by another User.

### AC-018: Target Date Validation

Optional target dates are validated and remain distinct from actual execution time.

### AC-019: Lifecycle Validation

Goal lifecycle operations follow the approved status model.

### AC-020: Movement Identity Preservation

Permitted Goal movement preserves Goal ID.

### AC-021: Related Resource Integrity

Goal operations do not silently invalidate related Milestones, Actions, Measurements, Schedules or Reviews.

### AC-022: No Automatic Progress Calculation

C03 does not independently calculate authoritative Progress.

### AC-023: Platform Independence

Goal business rules do not depend on a specific frontend, mobile platform or authentication provider.

# 20. TESTING REQUIREMENTS

## 20.1. Unit Tests

Required test groups:

- Goal identity validation.
- Goal title validation.
- Goal description validation.
- Goal target date validation.
- Workspace scope validation.
- Project scope validation.
- Parent Goal validation.
- Child Goal relationship validation.
- Self-parenting prevention.
- Circular hierarchy prevention.
- Parent reassignment validation.
- Parent relationship removal.
- Goal Tree construction.
- Ancestor traversal.
- Descendant traversal.
- Ownership consistency.
- Goal scope movement validation.
- Lifecycle validation when approved.

## 20.2. Integration Tests

Required scenarios:

1. Create an independent Workspace Goal.
2. Create a Project-owned Goal.
3. Create a Child Goal under a Root Goal.
4. Create a multi-level Goal hierarchy.
5. Retrieve a Goal Tree.
6. Retrieve Goal ancestors.
7. Retrieve Goal descendants.
8. Change a Goal's Parent.
9. Remove a Parent relationship when permitted.
10. Attempt self-parenting.
11. Attempt to create a circular hierarchy.
12. Attempt to create a cross-user Parent relationship.
13. Attempt an invalid Workspace scope relationship.
14. Attempt an invalid Project scope relationship.
15. Validate Goal target date updates.
16. Validate Goal scope movement with related resources.
17. Verify Goal identity preservation after approved movement.
18. Verify Goal lifecycle operations follow the approved state model.

Tests involving unapproved lifecycle or movement behavior must remain blocked or use explicitly approved assumptions.

## 20.3. Negative Tests

The implementation must test:

- Missing Goal ID.
- Unknown Goal.
- Empty title.
- Invalid title length.
- Invalid target date.
- Unknown Workspace.
- Unknown Project.
- Project and Workspace mismatch.
- Unknown Parent Goal.
- Parent Goal belonging to another User.
- Goal referencing itself.
- Circular hierarchy.
- Invalid Parent reassignment.
- Invalid scope movement.
- Invalid lifecycle transition.
- Deletion with unresolved dependent resources.
- Archival with unresolved descendant behavior.

## 20.4. Hierarchy Property Tests

Where supported by the project testing framework, test hierarchy invariants over generated relationship graphs.

Required properties:

- Every Goal has at most one Parent.
- No Goal is its own Parent.
- Valid hierarchies contain no cycles.
- Every Child relationship can be traced to a valid Parent.
- Traversal terminates.
- Ancestor and descendant traversal respect ownership boundaries.

## 20.5. Test Independence

Domain unit tests must not require:

- Authentication Provider.
- Browser.
- Frontend.
- Specific database vendor.
- Production data.

Integration tests may use test infrastructure but must not depend on production credentials.

# 21. IMPLEMENTATION BOUNDARIES

## 21.1. C03 Must Implement

- Goal domain model.
- Goal identity abstraction.
- Goal attributes and field constraints.
- Goal scope references.
- Parent–Child relationship model.
- Hierarchy invariants.
- Hierarchy validation.
- Goal Tree behavior.
- Ancestor and descendant traversal rules.
- Goal target date rules.
- Goal lifecycle constraints when approved.
- Goal scope movement validation.
- Domain error classifications.
- Unit tests for C03 rules.

## 21.2. C03 Must Not Implement

- Workspace creation.
- Project creation.
- Workspace ownership logic.
- Project ownership inheritance.
- Milestone management.
- Action management.
- Measurement management.
- Schedule management.
- Progress calculation.
- Review management.
- Authentication.
- JWT or OAuth.
- HTTP endpoints.
- UI state.
- AI Provider integration.
- Database migrations before D01 approval.
- Unapproved cascading deletion.
- Unapproved lifecycle transitions.

## 21.3. Dependency Boundaries

```text id="0g4v2j"
                  C01
        Identity & Ownership
                   |
                   v
                  C02
        Workspace & Project
                   |
                   v
                  C03
          Goal & Hierarchy
                   |
         +---------+---------+
         |         |         |
         v         v         v
        C04       C05       C06
     Milestone   Action  Measurement
                   |
                   v
                  C07
           Planning & Schedule
                   |
                   v
                  C08
                Progress
                   |
                   v
                  C09
                 Review
```

This diagram represents conceptual domain relationships, not a strict runtime call sequence.

# 22. IMPLEMENTATION TASK BREAKDOWN

| Task ID | Task | Deliverable |
|---|---|---|
| C03-IMP-001 | Define Goal identifier | GoalId abstraction |
| C03-IMP-002 | Define Goal domain model | Goal entity |
| C03-IMP-003 | Define Goal attributes and constraints | Goal attribute rules |
| C03-IMP-004 | Define Goal scope model | Goal scope representation |
| C03-IMP-005 | Define Parent–Child relationship | Hierarchy relationship model |
| C03-IMP-006 | Implement Goal identity validation | Goal identity validator |
| C03-IMP-007 | Implement Goal attribute validation | Goal attribute validator |
| C03-IMP-008 | Implement Goal scope validation integration | Scope validation adapter/contract |
| C03-IMP-009 | Implement Parent validation | Parent relationship validator |
| C03-IMP-010 | Implement self-parenting prevention | Hierarchy invariant validation |
| C03-IMP-011 | Implement cycle detection | Cycle detection logic |
| C03-IMP-012 | Implement Parent reassignment validation | Parent change validator |
| C03-IMP-013 | Implement Root Goal behavior | Root Goal rules |
| C03-IMP-014 | Implement Goal Tree construction | Goal Tree model |
| C03-IMP-015 | Implement ancestor traversal | Ancestor retrieval behavior |
| C03-IMP-016 | Implement descendant traversal | Descendant retrieval behavior |
| C03-IMP-017 | Implement Goal target date validation | Target date validator |
| C03-IMP-018 | Define lifecycle contracts | Lifecycle policy boundary |
| C03-IMP-019 | Implement approved lifecycle rules | Goal lifecycle behavior |
| C03-IMP-020 | Implement scope movement validation | Movement validator |
| C03-IMP-021 | Define C03 domain errors | Error definitions |
| C03-IMP-022 | Implement unit tests | C03 unit test suite |
| C03-IMP-023 | Implement hierarchy property tests | Hierarchy property test suite |
| C03-IMP-024 | Implement integration test fixtures | C03 integration fixtures |
| C03-IMP-025 | Verify C01 integration | Ownership integration verification |
| C03-IMP-026 | Verify C02 integration | Scope integration verification |
| C03-IMP-027 | Verify C04–C09 contracts | Cross-domain contract verification |
| C03-IMP-028 | Complete implementation documentation | C03 implementation notes |

## 22.1. Recommended Implementation Sequence

### Phase 1 — Goal Foundation
- C03-IMP-001
- C03-IMP-002
- C03-IMP-003
- C03-IMP-004
- C03-IMP-006
- C03-IMP-007

### Phase 2 — Hierarchy Foundation
- C03-IMP-005
- C03-IMP-009
- C03-IMP-010
- C03-IMP-011
- C03-IMP-012
- C03-IMP-013

### Phase 3 — Hierarchy Retrieval
- C03-IMP-014
- C03-IMP-015
- C03-IMP-016

### Phase 4 — Scope and Lifecycle
- C03-IMP-008
- C03-IMP-017
- C03-IMP-018
- C03-IMP-019, only when lifecycle decisions are approved
- C03-IMP-020, within approved movement scope

### Phase 5 — Verification
- C03-IMP-021
- C03-IMP-022
- C03-IMP-023
- C03-IMP-024
- C03-IMP-025
- C03-IMP-026
- C03-IMP-027
- C03-IMP-028

# 23. OPEN DECISIONS

The following decisions are carried forward from B03 and the Domain design.

They must not be silently converted into approved rules.

| Decision ID | Decision | Status | Impact |
|---|---|---|---|
| GOAL-001 | Goal status values and lifecycle | OPEN | Goal lifecycle |
| GOAL-002 | Parent deletion behavior toward Child Goals | OPEN | Hierarchy integrity |
| GOAL-003 | Whether moving a Parent Goal moves descendants | OPEN | Scope movement |
| GOAL-004 | Whether archiving a Parent Goal archives descendants | OPEN | Hierarchy lifecycle |
| GOAL-005 | Maximum Goal hierarchy depth | OPEN | Hierarchy validation |
| GOAL-006 | Child Goal Project scope compatibility | OPEN | Goal hierarchy |
| GOAL-007 | Goal reopening behavior | OPEN | Lifecycle |
| GOAL-008 | Goal hard-delete vs soft-delete policy | OPEN | Data retention |
| GOAL-009 | Goal movement support in MVP | OPEN | B03 implementation |
| GOAL-010 | Goal deletion with dependent resources | OPEN | C04–C09 |
| GOAL-011 | Parent completion conditions | OPEN | C08 interaction |
| GOAL-012 | Automatic Parent completion based on Child Goals | OPEN | C08 interaction |
| GOAL-013 | Parent and Child archival independence | OPEN | Lifecycle |
| GOAL-014 | Parent relationship removal constraints | OPEN | Hierarchy |
| GOAL-015 | Goal title length and content constraints | OPEN | Validation |
| GOAL-016 | Goal deletion and Review history retention | OPEN | C09 |
| GOAL-017 | Goal movement multi-module transaction strategy | OPEN | D01/Application Layer |

## 23.1. Core Implementation Policy

The following can be implemented without waiting for all OPEN decisions:

- Stable Goal ID.
- Required Goal title.
- Optional Goal description.
- Optional target date.
- Workspace scope validation.
- Optional Project scope validation.
- Optional Parent Goal relationship.
- One Parent Goal per Goal.
- No self-parenting.
- No circular hierarchy.
- Goal Tree retrieval.
- Ancestor and descendant traversal.
- Ownership consistency.
- Goal identity preservation during permitted relationship updates.

The following must remain blocked until approved:

- Final lifecycle status enum.
- Automatic parent/child lifecycle propagation.
- Cascading archival.
- Cascading deletion.
- Final parent/child movement strategy.
- Final hierarchy depth restriction.
- Automatic Progress calculation.
- Goal deletion policy.

# 24. IMPLEMENTATION HANDOFF CONTRACT

This section defines the boundary between Domain Design and the Code Factory.

## 24.1. Required Input Documents

The implementation agent must receive:

1. Master Blueprint v0.4.
2. B01 Authentication & User Context Specification.
3. B02 Workspace & Project Management Specification.
4. B03 Goal Management Specification.
5. C01 Identity & Ownership Implementation Specification.
6. C02 Workspace & Project Implementation Specification.
7. C03 Goal & Hierarchy Implementation Specification — this document.
8. Current Decision Log.
9. D03 Shared Types & Contracts, when available.
10. D04 Validation conventions, when available.
11. D06 Error Handling conventions, when available.

## 24.2. Implementation Instructions

The Code Factory must:

1. Inspect the existing repository before creating or modifying files.
2. Identify the existing language, framework, dependencies and coding conventions.
3. Inspect actual C01 and C02 implementation status.
4. Reuse existing `UserId`, `WorkspaceId`, `ProjectId` and related shared types.
5. Implement only C03 responsibilities.
6. Keep Goal logic independent of HTTP, UI, database vendors and Authentication Providers.
7. Reuse C01 ownership rules.
8. Reuse C02 Workspace and Project validation.
9. Keep Milestone management within C04.
10. Keep Action management within C05.
11. Keep Measurement management within C06.
12. Keep Progress calculation within C08.
13. Avoid creating database migrations before D01 approval.
14. Avoid inventing OPEN lifecycle and hierarchy movement policies.
15. Avoid automatic cascading deletion or archival.
16. Add tests for every implemented core rule.
17. Document specification conflicts and implementation blockers.
18. Avoid modifying unrelated modules.
19. Report actual test execution results.

## 24.3. Expected Code Factory Output

The implementation agent must return:

1. Repository inspection summary.
2. Existing C01/C02 integration status.
3. C03 implementation plan.
4. Files created or modified.
5. Goal domain model.
6. Hierarchy implementation.
7. Goal Tree and traversal behavior.
8. Goal scope validation.
9. Unit tests.
10. Hierarchy property tests where supported.
11. Integration tests or documented blockers.
12. Test execution results.
13. Remaining OPEN decisions.
14. Known limitations.
15. C03 completion report.

The implementation agent must not claim completion when tests have not been executed successfully.

# 25. DEFINITION OF DONE

C03 is considered `IMPLEMENTED & VERIFIED` when:

- Goal domain model is implemented.
- Goal identity is stable.
- Required and optional Goal attributes are validated.
- Independent Workspace Goal scope is supported.
- Project-owned Goal scope is supported.
- Workspace and Project scope validation is integrated.
- Parent–Child relationship model is implemented.
- Single-parent invariant is enforced.
- Self-parenting is rejected.
- Circular hierarchy is rejected.
- Parent reassignment is validated.
- Goal Tree retrieval works.
- Ancestor retrieval works.
- Descendant retrieval works.
- Ownership boundaries are enforced.
- Target date validation works.
- Approved lifecycle behavior is implemented.
- Unapproved lifecycle behavior is not invented.
- Goal scope movement validation follows approved policies.
- C01 and C02 integration tests pass.
- C03 unit tests pass.
- Available integration and property tests pass.
- Implementation boundaries are respected.
- Known limitations and OPEN decisions are documented.

---

# 26. FINAL STATUS

**Domain:** C03 — Goal & Hierarchy Rules

**Specification Status:** CORE SPECIFICATION COMPLETE

**Implementation Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED

**Ready Core:**
- Goal identity.
- Goal attributes.
- Independent Workspace Goal.
- Project-owned Goal.
- Goal scope validation.
- Parent–Child relationship model.
- Single-parent constraint.
- Self-parenting prevention.
- Circular hierarchy prevention.
- Goal Tree behavior.
- Ancestor and descendant traversal.
- Ownership consistency.
- Target date validation.

**Not Ready for Final Implementation:**
- Final Goal lifecycle status model.
- Parent deletion behavior.
- Parent archival propagation.
- Descendant movement policy.
- Maximum hierarchy depth.
- Parent/Child Project scope compatibility.
- Goal deletion and retention.
- Automatic Parent completion.
- Full cross-module movement transaction strategy.

**Implementation Principle:**

Goal is the central outcome entity of FLOW-UP. C03 owns its identity, scope references, hierarchy and lifecycle semantics.

Other Domains may reference Goal, but must not independently redefine Goal ownership, hierarchy or lifecycle rules.

C03 must remain the single authoritative source for Goal business behavior.
# FLOW-UP — C04 MILESTONE RULES
## Domain Implementation Specification

**Module:** C04  
**Domain:** Milestone Rules  
**Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED  
**Architecture baseline:** Master Blueprint v0.4  
**Depends on:** C01, C03  
**Integrates with:** C05, C08, C09

---

## 1. Purpose

C04 quản lý Milestone — các checkpoint quan trọng trên hành trình thực hiện một Goal.

C04 chịu trách nhiệm định nghĩa:
- Milestone là gì và thuộc Goal nào.
- Quy tắc tạo, cập nhật và truy xuất Milestone.
- Quy tắc sắp xếp Milestone trong một Goal.
- Điều kiện và dữ liệu hoàn thành Milestone.
- Các quy tắc vòng đời Milestone.
- Ảnh hưởng từ vòng đời Goal đến Milestone.
- Hợp đồng quan hệ giữa Milestone và Action.

C04 không chịu trách nhiệm quản lý Goal, Action, Schedule, Progress hoặc Review.

## 2. Scope

### 2.1. In Scope

- Milestone identity và attributes.
- Milestone–Goal relationship.
- Milestone ordering và position.
- Milestone lifecycle ở phạm vi đã được phê duyệt.
- Manual completion.
- Completion timestamp.
- Validation và domain invariants.
- Kiểm tra quan hệ với Action thông qua C05.
- Kiểm tra ownership thông qua C01.
- Kiểm tra Goal và Goal scope thông qua C03.
- Cung cấp dữ liệu Milestone cho C08 và C09 thông qua hợp đồng domain.

### 2.2. Out of Scope

C04 không được:
- Tạo, sửa, xóa hoặc thay đổi trạng thái Action.
- Tự tính Progress của Milestone hoặc Goal.
- Tự hoàn thành Goal khi tất cả Milestone hoàn thành.
- Tự hoàn thành Milestone khi tất cả Action hoàn thành.
- Quản lý lịch hoặc thời gian dự kiến thực hiện Action.
- Quản lý Review.
- Tự quyết định cascade archive/delete khi chưa có quyết định được duyệt.
- Tự định nghĩa database schema hoặc API transport.

## 3. Domain Ownership

| Resource / Rule | Owner |
|---|---|
| User ownership | C01 |
| Goal identity and lifecycle | C03 |
| Milestone identity and lifecycle | C04 |
| Action identity and lifecycle | C05 |
| Schedule and Daily Plan | C07 |
| Authoritative Progress | C08 |
| Review | C09 |
| Persistence | D01 |
| Shared contracts | D03 |
| Validation infrastructure | D04 |

C04 sở hữu mọi business rule trực tiếp liên quan đến Milestone.

C04 có thể yêu cầu C03 hoặc C05 xác minh một quan hệ, nhưng không được tự sửa dữ liệu thuộc quyền sở hữu của các module đó.

## 4. Domain Model

### 4.1. Milestone

Logical model:

| Field | Meaning | Status |
|---|---|---|
| id | Stable Milestone identity | Required |
| goal_id | Goal that owns the Milestone | Required |
| title | Milestone title | Required |
| description | Optional description | Optional |
| target_date | Intended target date | Optional |
| status | Milestone lifecycle status | OPEN |
| position | Ordering within its Goal | Proposed |
| completed_at | Actual completion timestamp | Optional |
| created_at | Creation timestamp | Required |
| updated_at | Last update timestamp | Required |
| archived_at | Archive timestamp | OPEN |

Đây là logical domain model, không phải yêu cầu tạo database schema chính xác như bảng trên.

### 4.2. Field Rules

**id**
- Stable identity.
- Không thay đổi khi Milestone được sắp xếp lại.
- Không tái sử dụng ID của Milestone đã xóa.

**goal_id**
- Required.
- Mỗi Milestone thuộc chính xác một Goal.
- Goal phải tồn tại và hợp lệ.
- Goal ownership được xác minh thông qua C01/C03.

**title**
- Required.
- Không chấp nhận giá trị rỗng hoặc chỉ chứa whitespace.
- Giới hạn độ dài tối đa vẫn là OPEN nếu chưa có convention chung.

**description**
- Optional.
- C04 không tự đặt giới hạn độ dài nếu chưa có quy định chung được duyệt.

**target_date**
- Optional.
- Là ngày mục tiêu của checkpoint.
- Không phải Schedule.
- Không phải thời điểm hoàn thành thực tế.
- Không tự động làm Milestone chuyển trạng thái khi ngày mục tiêu đã qua.

**status**
- Lifecycle state của Milestone.
- Danh sách trạng thái và transition chính thức vẫn là OPEN.

**position**
- Dùng để biểu diễn thứ tự Milestone trong phạm vi một Goal.
- Cách lưu trữ và chiến lược xử lý trùng position cần được thống nhất với D01.
- Không được dùng position làm identity.

**completed_at**
- Chỉ biểu diễn thời điểm hoàn thành thực tế.
- Không được lấy target_date hoặc Schedule làm giá trị thay thế.
- Phải nhất quán với trạng thái completion sau khi lifecycle policy được duyệt.

## 5. Milestone–Goal Relationship

### 5.1. Cardinality

Baseline:

- Một Goal có thể có zero hoặc nhiều Milestone.
- Một Milestone phải thuộc chính xác một Goal.

Quan hệ:

`Goal 1 ---- 0..N Milestones`

### 5.2. Ownership

Milestone không có owner độc lập với Goal.

Quyền truy cập Milestone được xác định thông qua:
1. Milestone tồn tại.
2. Milestone tham chiếu một Goal hợp lệ.
3. C01 xác minh User có quyền truy cập Goal.
4. C03 xác minh Goal và scope hợp lệ.

C04 không được tự tạo một ownership model riêng cho Milestone.

### 5.3. Scope Consistency

Milestone kế thừa scope từ Goal.

Nếu Goal thuộc Workspace độc lập, Milestone thuộc cùng phạm vi đó.

Nếu Goal thuộc Project, Milestone vẫn thuộc phạm vi Project thông qua Goal.

Không tạo `workspace_id` hoặc `project_id` độc lập cho Milestone nếu không có quyết định kiến trúc mới.

### 5.4. Goal Movement

Khi Goal được di chuyển sang scope khác:
- Milestone giữ nguyên identity.
- `goal_id` không đổi nếu Goal identity được giữ nguyên.
- Milestone tiếp tục kế thừa scope mới từ Goal.
- Không tự tạo lại Milestone.
- Không tự thay đổi Action association.
- C03 sở hữu operation di chuyển Goal.
- C04 phải bảo đảm các invariant của Milestone vẫn đúng sau operation.

## 6. Milestone Structure and Ordering

### 6.1. Multiple Milestones

Một Goal có thể có nhiều Milestone.

C04 không áp đặt số lượng Milestone tối đa khi chưa có quyết định được duyệt.

### 6.2. Ordering

Milestone có thể được sắp xếp trong phạm vi Goal.

Các operation dự kiến:
- Create Milestone at position.
- Move Milestone to another position.
- Reorder Milestones.
- Retrieve Milestones ordered by position.

### 6.3. Ordering Invariants

- Reordering không thay đổi Milestone identity.
- Reordering không thay đổi Goal association.
- Reordering không thay đổi lifecycle state.
- Milestone phải thuộc cùng Goal trong một operation reorder.
- Không cho phép position âm nếu position là số thứ tự không âm.
- Tính duy nhất của position và cách xử lý gap cần được thống nhất với D01.

### 6.4. Grouping

Grouping Milestones thành các nhóm là ngoài core scope.

Không triển khai Milestone Group entity hoặc nested Milestone structure nếu chưa có quyết định được duyệt.

## 7. Milestone Lifecycle

### 7.1. Lifecycle Concepts

Các hành động cần được xem xét:
- Create.
- Activate.
- Complete.
- Reopen.
- Archive.
- Restore.
- Delete.

### 7.2. Proposed Status Model

B04 đã đề xuất:
- `PENDING`
- `COMPLETED`

Việc bổ sung `IN_PROGRESS`, `ARCHIVED`, `DELETED` hoặc trạng thái khác chưa được phê duyệt.

Không được xem danh sách đề xuất là status enum chính thức.

### 7.3. Core Lifecycle Rules

Có thể triển khai:
- Tạo Milestone với trạng thái ban đầu theo default đã được thống nhất ở implementation contract; nếu chưa có, không tự chọn một enum tùy ý.
- Cập nhật title, description, target_date.
- Đánh dấu hoàn thành thủ công theo completion operation tách biệt.
- Ghi nhận completion timestamp khi completion policy đã được thống nhất.
- Từ chối thao tác trên Milestone không tồn tại.
- Kiểm tra ownership và Goal relationship trước mọi mutation.

Chưa được tự triển khai:
- Reopen policy.
- Archive/restore state transitions.
- Hard delete hoặc soft delete.
- Cascade behavior.
- Status transition graph đầy đủ.

### 7.4. Lifecycle Separation

Không đồng nhất:
- Completion với archival.
- Archival với deletion.
- Target date đã qua với overdue status.
- Milestone completion với Goal completion.

## 8. Completion Rules

### 8.1. Manual Completion

Manual completion là phương án baseline phù hợp với B04.

Người dùng có thể yêu cầu đánh dấu Milestone hoàn thành, nhưng operation phải tuân thủ lifecycle policy cuối cùng được duyệt.

### 8.2. Completion Conditions

Các vấn đề sau vẫn OPEN:
- Có bắt buộc tất cả Action liên quan phải hoàn thành không?
- Có cho phép hoàn thành Milestone khi Action vẫn chưa hoàn thành không?
- Có yêu cầu xác nhận bổ sung không?
- Có cho phép completion khi Goal đã completed không?

Không tự suy luận rằng Milestone chỉ được hoàn thành khi toàn bộ Action hoàn thành.

### 8.3. Completion Timestamp

Khi completion được chấp nhận:
- Ghi nhận thời điểm thực tế của operation.
- Không dùng target_date.
- Không dùng Schedule của Action.
- Không cho phép client tùy ý gửi timestamp hoàn thành nếu không có use case được duyệt.
- Quy tắc timezone và clock source phải theo convention chung của hệ thống.

### 8.4. Reopening

Reopening cần được hỗ trợ về mặt thiết kế nhưng chưa được phép chốt behavior.

OPEN:
- Có cho phép reopen không?
- Có xóa `completed_at` hay lưu completion history?
- Có tạo completion event mới khi hoàn thành lại không?
- Review/Progress history bị ảnh hưởng như thế nào?

## 9. Goal Lifecycle Effects

C03 là owner của Goal lifecycle. C04 chỉ định nghĩa các invariant phải được bảo toàn.

| Goal operation | Milestone requirement |
|---|---|
| Create Goal | Không cần tạo Milestone tự động |
| Complete Goal | Không tự động hoàn thành Milestone |
| Reopen Goal | Không tự động reopen Milestone |
| Archive Goal | Cascade behavior OPEN |
| Restore Goal | Restoration behavior OPEN |
| Delete Goal | Delete/dependency behavior OPEN |
| Move Goal scope | Milestone giữ Goal association và kế thừa scope mới |

C04 không tự thực hiện Goal lifecycle operation.

## 10. Milestone–Action Relationship Contract

### 10.1. Current Known Relationship

B04/B05 xác định Action có thể liên kết với Milestone, nhưng cardinality và quy tắc association vẫn OPEN.

Không giả định một trong các mô hình sau đã được duyệt:
- Một Action thuộc tối đa một Milestone.
- Một Milestone có nhiều Action.
- Một Action có thể thuộc nhiều Milestone.
- Action có thể liên kết trực tiếp Goal và đồng thời liên kết Milestone.

### 10.2. Required Cross-Domain Checks

Khi tạo hoặc thay đổi quan hệ Action–Milestone:
- C05 sở hữu Action và operation association.
- C04 xác minh Milestone tồn tại và hợp lệ.
- C03 xác minh Goal của Milestone.
- C01 xác minh quyền truy cập.
- Nếu Action có Goal association riêng, C05 phải kiểm tra tính nhất quán giữa Goal của Action và Goal của Milestone theo association policy đã duyệt.

### 10.3. C04 Responsibilities

C04 chỉ cung cấp contract để:
- Retrieve Milestone.
- Validate Milestone existence.
- Validate Milestone lifecycle eligibility.
- Resolve owning Goal.
- Validate whether a Milestone can accept an Action association under approved rules.

C04 không trực tiếp cập nhật `milestone_id` của Action.

### 10.4. Completion Effects

Không tự động:
- Hoàn thành Action khi Milestone hoàn thành.
- Reopen Action khi Milestone reopen.
- Xóa Schedule khi Milestone archive.
- Thay đổi Action association khi Milestone được reorder.

## 11. Progress and Review Relationships

### 11.1. Progress — C08

C04 cung cấp dữ liệu Milestone cần thiết cho C08.

C04 không:
- Tính tỷ lệ hoàn thành.
- Tính trọng số Milestone.
- Tự tính Goal Progress.
- Tự thay đổi trạng thái dựa trên Progress.

Quy tắc Milestone Progress và cách Milestone ảnh hưởng Goal Progress thuộc C08 và cần được phê duyệt.

### 11.2. Review — C09

C09 có thể sử dụng:
- Milestone identity.
- Milestone title.
- Milestone status.
- Target date.
- Completion information.

C04 không sở hữu Review hoặc Review snapshot.

Quy tắc lưu snapshot, lịch sử và retention thuộc C09/D01.

## 12. Domain Invariants

| ID | Invariant |
|---|---|
| C04-INV-001 | Every Milestone has one valid Goal |
| C04-INV-002 | A Milestone cannot exist without a valid Goal reference |
| C04-INV-003 | Milestone ownership is inherited through Goal |
| C04-INV-004 | Milestone scope follows its Goal |
| C04-INV-005 | Milestone identity remains stable during reorder |
| C04-INV-006 | Reorder does not change Goal association |
| C04-INV-007 | Target date is not actual completion time |
| C04-INV-008 | Schedule is not Milestone target date |
| C04-INV-009 | Milestone completion does not imply Goal completion |
| C04-INV-010 | Milestone completion does not automatically complete Actions |
| C04-INV-011 | C04 does not calculate authoritative Progress |
| C04-INV-012 | Lifecycle mutations require ownership validation |
| C04-INV-013 | Action association follows the approved C05/C04 contract |
| C04-INV-014 | No unapproved cascade behavior is allowed |

## 13. Operations and Contracts

Logical operations; actual API, class, function and repository names are determined by the existing codebase and D03/D05 contracts.

### 13.1. CRUD

- `createMilestone`
- `updateMilestone`
- `getMilestone`
- `getMilestonesByGoal`

### 13.2. Ordering

- `reorderMilestones`
- `moveMilestonePosition`

### 13.3. Lifecycle

- `completeMilestone`
- `reopenMilestone` — blocked until policy approval.
- `archiveMilestone` — blocked until policy approval.
- `restoreMilestone` — blocked until policy approval.
- `deleteMilestone` — blocked until deletion policy approval.

### 13.4. Validation

- `validateMilestoneOwnership`
- `validateMilestoneGoal`
- `validateMilestoneScope`
- `validateMilestoneLifecycle`
- `validateMilestoneCompletion`
- `validateMilestoneActionAssociation`
- `validateMilestoneReorder`

### 13.5. Contract Expectations

Every mutation must:
1. Resolve the Milestone or target Goal.
2. Validate existence.
3. Validate User access through C01/C03.
4. Validate domain invariants.
5. Execute only the operation owned by C04.
6. Return a domain result or a structured domain error.

Do not expose persistence-specific objects as the public domain contract.

## 14. Validation Catalog

| Error code | Meaning |
|---|---|
| MILESTONE_NOT_FOUND | Milestone does not exist |
| MILESTONE_ACCESS_DENIED | User cannot access Milestone |
| MILESTONE_INVALID_ID | Invalid Milestone identifier |
| MILESTONE_INVALID_TITLE | Missing or invalid title |
| MILESTONE_INVALID_DESCRIPTION | Invalid description |
| MILESTONE_INVALID_TARGET_DATE | Invalid target date |
| MILESTONE_GOAL_REQUIRED | Goal reference is required |
| MILESTONE_GOAL_NOT_FOUND | Referenced Goal does not exist |
| MILESTONE_GOAL_INVALID | Goal cannot own this Milestone |
| MILESTONE_OWNERSHIP_INVALID | Ownership validation failed |
| MILESTONE_SCOPE_INVALID | Milestone scope is inconsistent with Goal |
| MILESTONE_STATUS_INVALID | Unsupported status |
| MILESTONE_STATUS_TRANSITION_INVALID | Invalid lifecycle transition |
| MILESTONE_ALREADY_COMPLETED | Milestone is already completed |
| MILESTONE_NOT_COMPLETED | Milestone is not completed |
| MILESTONE_COMPLETION_BLOCKED | Completion is not permitted |
| MILESTONE_REOPEN_BLOCKED | Reopening is not permitted |
| MILESTONE_ARCHIVE_BLOCKED | Archival is not permitted |
| MILESTONE_RESTORE_BLOCKED | Restoration is not permitted |
| MILESTONE_DELETE_BLOCKED | Deletion is not permitted |
| MILESTONE_ACTION_RELATION_INVALID | Action association is invalid |
| MILESTONE_REORDER_INVALID | Invalid reorder request |
| MILESTONE_POSITION_CONFLICT | Position conflict |
| MILESTONE_DEPENDENCY_CONFLICT | Related domain dependency blocks operation |
| MILESTONE_VALIDATION_FAILED | General validation failure |

Error codes are proposed domain identifiers. They must be reconciled with the shared error convention in D06 before implementation.

## 15. Cross-Domain Integration

| Module | Required interaction |
|---|---|
| C01 | Validate User ownership/access |
| C03 | Resolve Goal, validate Goal lifecycle and scope |
| C05 | Validate Action association; C05 owns association mutation |
| C08 | Supply Milestone facts; C08 owns Progress calculation |
| C09 | Supply Milestone facts; C09 owns Review |
| D01 | Persistence |
| D03 | Shared types and contracts |
| D04 | Shared validation infrastructure |
| D06 | Error mapping |

### Integration Rule

C04 must not import or depend on UI components, database drivers, HTTP request objects, or AI provider implementations.

Cross-domain communication must follow the project's existing dependency direction and shared contract conventions.

## 16. Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| C04-AC-001 | A Milestone can be created for a valid Goal |
| C04-AC-002 | A Milestone cannot be created without a valid Goal |
| C04-AC-003 | A User cannot create or modify a Milestone under an inaccessible Goal |
| C04-AC-004 | A Milestone belongs to exactly one Goal |
| C04-AC-005 | A Goal can have multiple Milestones |
| C04-AC-006 | Milestone scope is resolved through Goal |
| C04-AC-007 | Milestone title validation rejects blank values |
| C04-AC-008 | Description can be omitted |
| C04-AC-009 | Target date can be omitted |
| C04-AC-010 | Invalid target date values are rejected |
| C04-AC-011 | Target date is not treated as completion timestamp |
| C04-AC-012 | Milestones can be retrieved by Goal |
| C04-AC-013 | Reordering preserves Milestone identity |
| C04-AC-014 | Reordering cannot move a Milestone to another Goal |
| C04-AC-015 | Completion requires valid ownership and lifecycle checks |
| C04-AC-016 | Completion timestamp is not copied from target date |
| C04-AC-017 | Milestone completion does not automatically complete Goal |
| C04-AC-018 | Milestone completion does not automatically complete Action |
| C04-AC-019 | C04 does not calculate authoritative Progress |
| C04-AC-020 | Goal movement preserves Milestone identity and Goal association |
| C04-AC-021 | No unapproved cascade archive/delete is executed |
| C04-AC-022 | Action association validation follows approved cross-domain policy |
| C04-AC-023 | Domain errors use the shared error contract |

## 17. Testing Requirements

### Unit Tests
- Milestone creation validation.
- Required Goal reference.
- Title validation.
- Optional description and target date.
- Goal ownership validation.
- Milestone scope resolution.
- Completion validation.
- Position validation.
- Reorder invariants.

### Integration Tests
- C01 + C03 + C04: ownership and Goal access.
- C03 + C04: Goal movement and Milestone identity.
- C04 + C05: Action–Milestone association validation.
- C04 + C08: Progress data contract.
- C04 + C09: Review data contract.

### Negative Tests
- Nonexistent Goal.
- Inaccessible Goal.
- Invalid title.
- Invalid date.
- Unsupported status.
- Invalid transition.
- Invalid reorder request.
- Action associated with an incompatible Goal.
- Unapproved lifecycle operation.

### Invariant Tests
- Reordering never changes IDs.
- Reordering never changes Goal references.
- Goal movement does not orphan Milestones.
- Milestone completion never silently completes Goal or Action.
- C04 never mutates Action-owned data.

## 18. Implementation Boundaries

### Ready for Core Implementation
- Logical Milestone model.
- Stable identity.
- Required Goal association.
- Ownership validation through C01/C03.
- Title and optional description.
- Optional target date validation.
- Retrieval by Goal.
- Milestone ordering, provided the implementation uses a reversible and non-destructive strategy consistent with existing persistence conventions.
- Goal scope inheritance.
- Domain error definitions.
- Cross-domain interface contracts.

### Partially Blocked
- Exact status enum.
- Full lifecycle transition graph.
- Completion eligibility with incomplete Actions.
- Reopen behavior.
- Archive/restore behavior.
- Hard delete vs soft delete.
- Goal lifecycle cascade behavior.
- Action–Milestone cardinality and association mutation rules.
- Progress contribution.
- Review snapshot/retention.
- Grouping and maximum count limits.

Code Factory must not implement blocked behavior by guessing. It may define interfaces or TODO boundaries where needed.

## 19. Implementation Task Breakdown

| Task ID | Task | Dependency |
|---|---|---|
| C04-IMP-001 | Inspect existing architecture and domain conventions | None |
| C04-IMP-002 | Identify existing Goal and ownership contracts | C01, C03 |
| C04-IMP-003 | Define Milestone domain model | C04-IMP-001 |
| C04-IMP-004 | Define Milestone domain errors | D06 convention |
| C04-IMP-005 | Implement required-field validation | C04-IMP-003 |
| C04-IMP-006 | Implement Goal existence validation | C03 |
| C04-IMP-007 | Implement ownership validation | C01 |
| C04-IMP-008 | Implement scope resolution through Goal | C03 |
| C04-IMP-009 | Implement create operation | C04-IMP-005–008 |
| C04-IMP-010 | Implement update operation | C04-IMP-005 |
| C04-IMP-011 | Implement retrieval by ID and Goal | C04-IMP-003 |
| C04-IMP-012 | Implement ordering contract | C04-IMP-003 |
| C04-IMP-013 | Implement reorder validation | C04-IMP-012 |
| C04-IMP-014 | Implement only approved completion behavior | Lifecycle approval |
| C04-IMP-015 | Define C05 association validation interface | C05 |
| C04-IMP-016 | Define C08 Progress read contract | C08 |
| C04-IMP-017 | Define C09 Review read contract | C09 |
| C04-IMP-018 | Write unit and invariant tests | C04 core |
| C04-IMP-019 | Write cross-domain integration tests | C01, C03, C05 |
| C04-IMP-020 | Verify no ownership boundary violations | All |
| C04-IMP-021 | Document unresolved decisions and implementation status | All |

## 20. OPEN Decisions

| ID | Decision | Status |
|---|---|---|
| MILESTONE-001 | Official status enum | OPEN |
| MILESTONE-002 | Is IN_PROGRESS required? | OPEN |
| MILESTONE-003 | Is reopening allowed? | OPEN |
| MILESTONE-004 | Reopening timestamp/history behavior | OPEN |
| MILESTONE-005 | Can a Milestone complete with incomplete Actions? | OPEN |
| MILESTONE-006 | Are Actions required for completion? | OPEN |
| MILESTONE-007 | Can a Milestone be completed if its Goal is completed? | OPEN |
| MILESTONE-008 | Goal archive effect on Milestones | OPEN |
| MILESTONE-009 | Goal restore effect on Milestones | OPEN |
| MILESTONE-010 | Goal deletion effect on Milestones | OPEN |
| MILESTONE-011 | Milestone archive/restore lifecycle | OPEN |
| MILESTONE-012 | Hard delete vs soft delete | OPEN |
| MILESTONE-013 | Action–Milestone cardinality | OPEN |
| MILESTONE-014 | Can one Action belong to multiple Milestones? | OPEN |
| MILESTONE-015 | Can a Milestone accept an Action whose direct Goal differs? | OPEN |
| MILESTONE-016 | Milestone position uniqueness and ordering strategy | OPEN |
| MILESTONE-017 | Milestone grouping | OPEN |
| MILESTONE-018 | Maximum Milestones per Goal | OPEN |
| MILESTONE-019 | Progress contribution of Milestone | OPEN — C08 |
| MILESTONE-020 | Review snapshot and retention | OPEN — C09 |

## 21. Definition of Done

C04 core is complete when:
- Milestone identity and Goal relationship are implemented.
- Ownership and scope validation work through C01/C03.
- Create, update and retrieval contracts are tested.
- Optional target date and required title validation work.
- Ordering does not violate identity or Goal association.
- C05 integration contract is explicit.
- No unapproved lifecycle/cascade behavior is implemented.
- Unit, negative and integration tests pass.
- Domain errors follow D06/D03 conventions.
- OPEN decisions are documented.
- No code outside C04 ownership is silently modified.

**Final status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED.

# FLOW-UP — C06 MEASUREMENT RULES
## Domain Implementation Specification

**Module:** C06  
**Domain:** Measurement Rules  
**Status:** DETAILED DESIGN — PARTIALLY BLOCKED  
**Architecture baseline:** Master Blueprint v0.4  
**Depends on:** C01, C03  
**Integrates with:** C08, C09

---

## 1. Purpose

C06 quản lý Measurement — định nghĩa đo lường gắn với Goal và các giá trị được ghi nhận theo thời gian.

C06 chịu trách nhiệm:
- Định nghĩa Measurement.
- Xác định kiểu dữ liệu và đơn vị đo.
- Quản lý baseline và target.
- Ghi nhận Measurement values.
- Truy xuất giá trị hiện tại và lịch sử.
- Bảo đảm tính nhất quán giữa definition và recorded values.
- Cung cấp dữ liệu đo lường cho C08 và C09.

C06 không tính Progress và không sở hữu Goal.

## 2. Scope

### 2.1. In Scope

- Measurement definition.
- Measurement identity.
- Measurement–Goal relationship.
- Value type contract.
- Unit and precision validation.
- Baseline and target configuration.
- Recorded value model.
- Historical records.
- Latest value resolution.
- Measurement lifecycle.
- Validation and domain invariants.
- Read contracts for C08 and C09.

### 2.2. Out of Scope

C06 không:
- Tính Goal hoặc Project Progress.
- Tự đánh giá mức độ hoàn thành Goal.
- Tự thay đổi Goal status.
- Quản lý Goal lifecycle.
- Quản lý Review.
- Quản lý Schedule hoặc Action execution.
- Tự thực hiện unit conversion nếu chưa có policy được duyệt.
- Tự quyết định xóa lịch sử khi Measurement definition thay đổi.
- Quản lý AI proposal.

## 3. Domain Ownership

| Resource / Rule | Owner |
|---|---|
| User ownership | C01 |
| Goal | C03 |
| Measurement definition | C06 |
| Measurement records | C06 |
| Authoritative Progress | C08 |
| Review | C09 |
| Persistence | D01 |
| Shared types | D03 |
| Validation infrastructure | D04 |
| Error mapping | D06 |

C06 sở hữu Measurement definition và recorded values.

C08 chỉ đọc dữ liệu cần thiết để tính Progress. C09 chỉ đọc dữ liệu cần thiết để tạo Review.

## 4. Domain Concepts

### 4.1. Measurement Definition

Measurement Definition mô tả một đại lượng hoặc tiêu chí mà User muốn theo dõi để đánh giá tiến triển của Goal.

Ví dụ khái niệm:
- Số lượng bài tập đã hoàn thành.
- Số giờ học.
- Điểm số.
- Trạng thái Boolean của một điều kiện.
- Một giá trị định lượng khác.

Ví dụ không phải là danh sách loại Measurement đã được phê duyệt.

### 4.2. Measurement Record

Measurement Record là một lần ghi nhận giá trị thực tế của một Measurement Definition.

Phân biệt:
- Definition: đo cái gì và đo như thế nào.
- Record: giá trị được ghi nhận tại một thời điểm.

Không ghi đè lịch sử chỉ vì User cập nhật giá trị mới.

### 4.3. Measurement Identity

Mỗi Measurement có stable identity.

Identity không thay đổi khi:
- Tên Measurement thay đổi.
- Description thay đổi.
- Target thay đổi.
- Có thêm Measurement Record.
- Measurement được sắp xếp lại trong UI.

Không tái sử dụng ID của Measurement đã xóa.

## 5. Measurement Definition Model

Logical model:

| Field | Meaning | Status |
|---|---|---|
| id | Stable Measurement identity | Required |
| goal_id | Owning Goal | Required |
| name | Measurement name | Required |
| description | Description | Optional |
| purpose | What the Measurement represents | Optional / OPEN |
| value_type | Type of recorded value | OPEN |
| unit | Measurement unit | OPEN |
| baseline_value | Starting/reference value | OPEN |
| target_value | Desired target | OPEN |
| target_direction | Increasing/decreasing/range/other | OPEN |
| status | Definition lifecycle | OPEN |
| created_at | Creation timestamp | Required |
| updated_at | Last update timestamp | Required |
| archived_at | Archive timestamp | OPEN |

Đây là logical model, không phải database schema đã được duyệt.

### 5.1. Required Fields

- `id`: stable identity.
- `goal_id`: valid Goal reference.
- `name`: non-empty Measurement name.
- `created_at` và `updated_at`: system timestamps theo convention chung.

### 5.2. Optional Fields

Description và purpose có thể để trống.

Không yêu cầu target hoặc baseline nếu Measurement chưa có cấu hình tương ứng.

### 5.3. Definition Versioning

Versioning là một vấn đề OPEN.

Nếu value type, unit hoặc target configuration thay đổi, cần xác định:
- Historical records có tiếp tục dùng definition cũ không?
- Có cần version snapshot không?
- Có cần migrate historical values không?
- C08 sử dụng target hiện tại hay target tại thời điểm record được tạo?

Không tự triển khai versioning hoặc migration policy khi chưa được duyệt.

## 6. Supported Value Types

Các kiểu sau là nhóm cần xem xét, chưa phải danh sách được duyệt để triển khai đầy đủ.

| Type | Representation concept | Validation requirement | Progress compatibility |
|---|---|---|---|
| Numeric | Number | Finite value, precision, range | C08 policy required |
| Boolean | True/false | Strict Boolean | C08 policy required |
| Text | String | Length/format policy | Comparison policy OPEN |
| Date/Time | Date or timestamp | Valid temporal representation | C08 policy required |
| Structured | Structured data | Explicit schema required | OPEN |

### 6.1. Numeric

Nếu Numeric được duyệt:
- Không chấp nhận NaN hoặc Infinity.
- Phải xác định precision và scale.
- Phải xác định valid range nếu có.
- Baseline và target phải tương thích với numeric value.
- Không tự chuyển đổi unit.

### 6.2. Boolean

Nếu Boolean được duyệt:
- Chỉ chấp nhận true/false.
- Không tự chuyển `"true"` hoặc `"false"` thành Boolean nếu không có normalization policy.
- Cách xác định target đạt hay chưa thuộc C08.

### 6.3. Text

Text không có phép so sánh Progress mặc định.

Cần quyết định:
- Có hỗ trợ text equality không?
- Có hỗ trợ categorical values không?
- Có danh sách giá trị hợp lệ không?
- Có cho phép text target không?

### 6.4. Date/Time

Cần phân biệt:
- Calendar date.
- Instant/timestamp.
- Duration.

Không dùng một representation chung cho các khái niệm khác nhau nếu điều đó làm mất ý nghĩa dữ liệu.

### 6.5. Structured Values

Structured values nằm ngoài core scope cho đến khi có use case và schema cụ thể.

Không tạo arbitrary JSON Measurement type như một cách né tránh việc định nghĩa value type.

## 7. Measurement–Goal Relationship

### 7.1. Cardinality

Baseline từ kiến trúc:
- Một Goal có thể có zero hoặc nhiều Measurement definitions.
- Một Measurement thuộc chính xác một Goal.

Quan hệ:

`Goal 1 ---- 0..N Measurements`

### 7.2. Ownership

Measurement không có owner độc lập với Goal.

Quyền truy cập:
1. Resolve Measurement.
2. Resolve owning Goal.
3. C01 xác minh User access.
4. C03 xác minh Goal tồn tại và scope hợp lệ.

### 7.3. Scope Consistency

Measurement kế thừa scope từ Goal.

Không lưu Workspace hoặc Project association độc lập cho Measurement nếu không có quyết định kiến trúc mới.

### 7.4. Goal Scope Movement

Khi Goal chuyển scope:
- Measurement identity giữ nguyên.
- Goal association giữ nguyên nếu Goal identity không đổi.
- Measurement tiếp tục kế thừa scope mới.
- Không tự tạo lại Measurement.
- Không tự xóa historical records.

C03 sở hữu Goal movement; C06 bảo toàn Measurement invariants.

## 8. Measurement Recording

### 8.1. Logical Record Model

| Field | Meaning | Status |
|---|---|---|
| id | Record identity | Required concept |
| measurement_id | Owning Measurement | Required |
| value | Recorded value | Required |
| recorded_at | Time represented by the record | Required concept |
| source | Origin of the record | OPEN |
| note | Optional note | Optional |
| created_at | Record creation timestamp | Required |
| updated_at | Last correction timestamp | OPEN |

Logical model không áp đặt cách lưu trữ cụ thể.

### 8.2. Recording Rules

Mỗi record phải:
- Tham chiếu Measurement hợp lệ.
- Có value tương thích với Measurement value type.
- Có timestamp hợp lệ.
- Thuộc đúng Measurement.
- Tuân thủ unit configuration nếu có.
- Có nguồn ghi nhận theo policy được duyệt.

### 8.3. Record Source

Source có thể biểu diễn nguồn của giá trị, ví dụ:
- User input.
- Imported data.
- System-generated data.

Đây chỉ là các ví dụ. Source enum và provenance policy vẫn OPEN.

Không tự cho phép AI ghi Measurement record trực tiếp.

### 8.4. Current Value

C06 cần cung cấp operation truy xuất current value.

Tuy nhiên, "current" cần được định nghĩa chính xác:
- Record có `recorded_at` mới nhất?
- Record mới nhất được tạo?
- Record mới nhất được xác nhận hợp lệ?
- Có cho phép backdated record không?

Không dùng `created_at` thay cho `recorded_at` một cách mặc định.

## 9. Measurement History

### 9.1. History

Historical records phải giữ được mối liên hệ với Measurement.

C06 cần hỗ trợ:
- Retrieve records by Measurement.
- Retrieve records ordered by the agreed timestamp.
- Retrieve latest valid record.
- Retrieve records within a date range nếu được yêu cầu.

### 9.2. Ordering

Ordering chính thức dựa trên timestamp semantics được duyệt.

Không giả định `created_at` luôn phản ánh thứ tự đo lường thực tế.

### 9.3. Historical Correction

OPEN:
- Có được phép sửa historical value không?
- Có giữ previous value không?
- Có cần correction reason không?
- Có cần audit history không?

Không âm thầm ghi đè dữ liệu lịch sử quan trọng.

### 9.4. Duplicate Records

OPEN:
- Hai record cùng Measurement và timestamp có được phép không?
- Có deduplication không?
- Có cần idempotency key không?

Không tự loại bỏ record chỉ vì hai value giống nhau.

### 9.5. Record Deletion

Deletion policy cần bảo toàn khả năng truy vết.

Không cascade delete historical records khi Measurement definition bị archive hoặc delete nếu chưa có quyết định được duyệt.

## 10. Baseline and Target Rules

### 10.1. Baseline

Baseline là giá trị tham chiếu dùng để so sánh với các giá trị đo lường tiếp theo.

Baseline có thể không tồn tại.

Không tự lấy record đầu tiên làm baseline nếu chưa có policy.

### 10.2. Target

Target là giá trị hoặc điều kiện mà User muốn đạt được.

Target có thể không tồn tại.

Không tự tạo target mặc định.

### 10.3. Target Direction

Các hướng cần xem xét:

- Increasing: giá trị tăng là tốt hơn.
- Decreasing: giá trị giảm là tốt hơn.
- Range: giá trị nằm trong khoảng mong muốn.
- Boolean: đạt một điều kiện true/false.
- Other: chỉ khi có use case và policy rõ ràng.

Các hướng trên chưa phải enum chính thức.

### 10.4. Missing Baseline or Target

Missing baseline hoặc target không đồng nghĩa với zero.

C06 phải giữ được trạng thái thiếu dữ liệu rõ ràng để C08 xử lý.

### 10.5. Target Modification

Khi target thay đổi:
- Không tự sửa historical values.
- Không tự thay đổi baseline.
- Không tự tính lại hoặc ghi đè historical Progress.
- C08 phải quyết định cách sử dụng target hiện tại hay historical target.
- Nếu versioning cần thiết, phải có quyết định riêng.

## 11. Unit and Value Consistency

### 11.1. Unit

Unit phải tương thích với value type và Measurement purpose.

### 11.2. Numeric Precision

Precision và rounding policy cần được định nghĩa nhất quán giữa validation, persistence và calculation.

Không dùng floating-point rounding tùy tiện cho các giá trị cần độ chính xác xác định.

### 11.3. Unit Conversion

OPEN:
- Có hỗ trợ conversion không?
- Conversion thực hiện ở C06 hay shared capability?
- Có chuẩn hóa value khi lưu không?
- Historical value giữ unit gốc hay unit chuẩn?
- Conversion có cần ghi lại provenance không?

Không tự chuyển đổi unit trong background.

### 11.4. Incompatible Units

Từ chối giá trị có unit không tương thích theo validation contract đã được duyệt.

Không âm thầm bỏ unit hoặc thay unit bằng mặc định.

## 12. Measurement Lifecycle

Các lifecycle concepts:
- Create definition.
- Activate.
- Modify.
- Deactivate.
- Archive.
- Restore.
- Delete.

Record lifecycle và definition lifecycle là hai khái niệm riêng.

Status enum và transition graph vẫn OPEN.

### Core Rules

Có thể triển khai:
- Create definition.
- Update metadata trong phạm vi cho phép.
- Retrieve definition.
- Record value.
- Retrieve history.
- Validate definition/value consistency.

Chưa được tự triển khai:
- Deactivation behavior.
- Archive/restore.
- Hard delete/soft delete.
- Cascade deletion.
- Historical record retention after definition deletion.

Không đồng nhất:
- Deactivation với archival.
- Archival với deletion.
- Definition update với historical record correction.

## 13. Progress and Review Integration

### 13.1. C08 — Progress

C06 cung cấp:
- Measurement definition.
- Value type.
- Unit.
- Baseline.
- Target.
- Target direction nếu đã được duyệt.
- Current value.
- Historical values khi C08 cần.

C08 sở hữu:
- Progress formula.
- Target evaluation.
- Weighting.
- Aggregation.
- Missing-data behavior.
- Progress history.

C06 không tự trả về authoritative Progress.

### 13.2. C09 — Review

C09 có thể sử dụng:
- Measurement definition.
- Current value.
- Historical values.
- Target và baseline configuration.
- Recorded timestamps.
- Source và notes nếu phù hợp.

C06 không sở hữu Review summary hoặc Review snapshot.

## 14. Domain Invariants

| ID | Invariant |
|---|---|
| C06-INV-001 | Every Measurement belongs to one valid Goal |
| C06-INV-002 | Measurement ownership is inherited through Goal |
| C06-INV-003 | Measurement scope follows Goal |
| C06-INV-004 | Every Record belongs to one valid Measurement |
| C06-INV-005 | Recorded value matches the approved value type |
| C06-INV-006 | Unit is compatible with Measurement configuration |
| C06-INV-007 | Baseline and target follow the approved type rules |
| C06-INV-008 | Missing baseline/target is not interpreted as zero |
| C06-INV-009 | Historical records remain traceable |
| C06-INV-010 | Recorded timestamp and creation timestamp are distinct concepts |
| C06-INV-011 | Definition changes do not silently rewrite history |
| C06-INV-012 | Goal movement does not orphan Measurement |
| C06-INV-013 | C06 does not calculate authoritative Progress |
| C06-INV-014 | Record mutation validates Measurement ownership |
| C06-INV-015 | No unapproved cascade deletion is allowed |

## 15. Operations and Contracts

Logical operations; actual implementation names follow repository conventions.

### 15.1. Definition

- `createMeasurement`
- `updateMeasurement`
- `getMeasurement`
- `getMeasurementsByGoal`
- `validateMeasurementDefinition`
- `validateMeasurementScope`

### 15.2. Recording

- `recordMeasurementValue`
- `updateMeasurementRecord` — subject to correction policy.
- `getMeasurementRecord`
- `getMeasurementRecords`
- `getCurrentMeasurementValue`
- `getMeasurementHistory`

### 15.3. Target and Baseline

- `validateBaseline`
- `validateTarget`
- `validateTargetDirection`
- `validateMeasurementUnit`
- `validateMeasurementValue`

### 15.4. Lifecycle

- `activateMeasurement` — subject to approval.
- `deactivateMeasurement` — subject to approval.
- `archiveMeasurement` — subject to approval.
- `restoreMeasurement` — subject to approval.
- `deleteMeasurement` — subject to deletion policy.

### 15.5. Contract Requirements

Every mutation must:
1. Resolve the Measurement or owning Goal.
2. Validate existence.
3. Validate User access through C01/C03.
4. Validate definition/value consistency.
5. Execute only C06-owned mutations.
6. Return a domain result or structured error.

## 16. Validation Catalog

| Error code | Meaning |
|---|---|
| MEASUREMENT_NOT_FOUND | Measurement does not exist |
| MEASUREMENT_ACCESS_DENIED | User cannot access Measurement |
| MEASUREMENT_INVALID_ID | Invalid Measurement identifier |
| MEASUREMENT_INVALID_NAME | Missing or invalid name |
| MEASUREMENT_INVALID_DESCRIPTION | Invalid description |
| MEASUREMENT_GOAL_REQUIRED | Goal reference required |
| MEASUREMENT_GOAL_NOT_FOUND | Goal does not exist |
| MEASUREMENT_GOAL_INVALID | Goal cannot own Measurement |
| MEASUREMENT_OWNERSHIP_INVALID | Ownership validation failed |
| MEASUREMENT_SCOPE_INVALID | Measurement scope inconsistent |
| MEASUREMENT_VALUE_TYPE_REQUIRED | Value type missing |
| MEASUREMENT_VALUE_TYPE_UNSUPPORTED | Unsupported value type |
| MEASUREMENT_VALUE_INVALID | Recorded value invalid |
| MEASUREMENT_UNIT_INVALID | Invalid unit |
| MEASUREMENT_UNIT_INCOMPATIBLE | Incompatible unit |
| MEASUREMENT_PRECISION_INVALID | Invalid numeric precision |
| MEASUREMENT_BASELINE_INVALID | Invalid baseline |
| MEASUREMENT_TARGET_INVALID | Invalid target |
| MEASUREMENT_TARGET_DIRECTION_INVALID | Invalid target direction |
| MEASUREMENT_RECORD_NOT_FOUND | Record does not exist |
| MEASUREMENT_RECORD_INVALID | Invalid record |
| MEASUREMENT_RECORD_OWNERSHIP_INVALID | Record belongs to another Measurement |
| MEASUREMENT_TIMESTAMP_INVALID | Invalid timestamp |
| MEASUREMENT_HISTORY_CONFLICT | Historical correction/ordering conflict |
| MEASUREMENT_DUPLICATE_RECORD | Duplicate record under approved policy |
| MEASUREMENT_STATUS_INVALID | Invalid status |
| MEASUREMENT_STATUS_TRANSITION_INVALID | Invalid lifecycle transition |
| MEASUREMENT_ARCHIVE_BLOCKED | Archival not permitted |
| MEASUREMENT_RESTORE_BLOCKED | Restoration not permitted |
| MEASUREMENT_DELETE_BLOCKED | Deletion not permitted |
| MEASUREMENT_DEPENDENCY_CONFLICT | Related domain dependency blocks operation |
| MEASUREMENT_VALIDATION_FAILED | General validation failure |

Error identifiers must follow D06 shared conventions.

## 17. Cross-Domain Integration

| Module | Interaction |
|---|---|
| C01 | User access and ownership |
| C03 | Goal existence, scope and movement |
| C08 | Read Measurement facts; calculate Progress |
| C09 | Read Measurement facts; create Review |
| D01 | Persistence |
| D03 | Shared types and contracts |
| D04 | Validation infrastructure |
| D06 | Error mapping |

C06 must not depend on UI, HTTP transport, database drivers or AI provider implementations.

## 18. Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| C06-AC-001 | Measurement can be created for a valid Goal |
| C06-AC-002 | Measurement cannot exist without a valid Goal |
| C06-AC-003 | Ownership is validated through C01/C03 |
| C06-AC-004 | A Goal can have multiple Measurements |
| C06-AC-005 | Measurement scope follows Goal |
| C06-AC-006 | Measurement identity remains stable |
| C06-AC-007 | Required name validation rejects blank values |
| C06-AC-008 | Optional metadata can be omitted |
| C06-AC-009 | Unsupported value types are rejected |
| C06-AC-010 | Recorded values match approved value type |
| C06-AC-011 | Unit validation follows the approved unit policy |
| C06-AC-012 | Baseline and target type compatibility is validated |
| C06-AC-013 | Missing baseline/target is not interpreted as zero |
| C06-AC-014 | A Record references one valid Measurement |
| C06-AC-015 | Historical records can be retrieved |
| C06-AC-016 | Current value follows the approved latest-value rule |
| C06-AC-017 | Historical correction follows the approved policy |
| C06-AC-018 | Goal scope movement does not orphan Measurement |
| C06-AC-019 | Definition update does not silently rewrite history |
| C06-AC-020 | C06 does not calculate authoritative Progress |
| C06-AC-021 | C06 does not create Review records |
| C06-AC-022 | No unapproved cascade deletion is executed |
| C06-AC-023 | Domain errors follow D06 conventions |

## 19. Testing Requirements

### Unit Tests
- Measurement definition validation.
- Goal association.
- Ownership validation.
- Value type validation.
- Unit compatibility.
- Baseline/target validation.
- Record validation.
- Timestamp validation.
- Current-value selection.
- History ordering.

### Integration Tests
- C01 + C03 + C06: ownership and Goal scope.
- C03 + C06: Goal movement and Measurement preservation.
- C06 + C08: Progress read contract.
- C06 + C09: Review read contract.

### Negative Tests
- Missing Goal.
- Inaccessible Goal.
- Invalid name.
- Unsupported value type.
- Incompatible value.
- Invalid unit.
- Invalid baseline/target.
- Invalid timestamp.
- Record referencing another Measurement.
- Unapproved historical correction.
- Unapproved deletion.

### Invariant Tests
- Goal movement does not orphan Measurement.
- Historical records remain traceable.
- Definition changes do not silently rewrite history.
- C06 never calculates authoritative Progress.
- C06 never mutates Goal or Review.

## 20. Implementation Boundaries

### Ready for Core Implementation
- Logical Measurement definition.
- Stable identity.
- Goal association.
- Ownership and scope validation.
- Required name and optional metadata.
- Measurement Record relationship.
- Contract separation between definition and recorded values.
- Domain error structure.
- C08/C09 read interfaces.

### Partially Blocked
- Official supported value types.
- Value representation and precision.
- Unit catalog and conversion.
- Baseline/target semantics.
- Target direction.
- Current-value resolution.
- Historical correction.
- Duplicate handling.
- Record deletion and retention.
- Definition versioning.
- Lifecycle and status transitions.
- Progress compatibility and formulas.
- Review snapshot behavior.

Do not implement a permanent type system or historical migration policy based on assumptions.

## 21. Implementation Task Breakdown

| Task ID | Task | Dependency |
|---|---|---|
| C06-IMP-001 | Inspect repository and domain conventions | None |
| C06-IMP-002 | Inspect C01/C03 contracts | C01, C03 |
| C06-IMP-003 | Define Measurement logical model | C06-IMP-001 |
| C06-IMP-004 | Define Measurement Record logical model | C06-IMP-003 |
| C06-IMP-005 | Define domain errors | D06 |
| C06-IMP-006 | Implement Goal/ownership validation | C01, C03 |
| C06-IMP-007 | Implement definition validation | C06-IMP-003 |
| C06-IMP-008 | Implement approved value type validation | Value type decision |
| C06-IMP-009 | Implement record validation | C06-IMP-004 |
| C06-IMP-010 | Implement definition create/update/retrieval | C06 core |
| C06-IMP-011 | Implement record creation/retrieval | C06 core |
| C06-IMP-012 | Implement history query contract | History policy |
| C06-IMP-013 | Implement current-value resolution | Latest-value policy |
| C06-IMP-014 | Define baseline/target validation contract | Target policy |
| C06-IMP-015 | Define C08 read contract | C08 |
| C06-IMP-016 | Define C09 read contract | C09 |
| C06-IMP-017 | Write unit and negative tests | C06 core |
| C06-IMP-018 | Write cross-domain integration tests | C01, C03 |
| C06-IMP-019 | Verify no Progress calculation exists in C06 | C08 |
| C06-IMP-020 | Document unresolved decisions | All |

## 22. OPEN Decisions

| ID | Decision | Status |
|---|---|---|
| MEASUREMENT-001 | Official supported value types | OPEN |
| MEASUREMENT-002 | Numeric precision and scale | OPEN |
| MEASUREMENT-003 | Boolean target semantics | OPEN |
| MEASUREMENT-004 | Text comparison semantics | OPEN |
| MEASUREMENT-005 | Date vs timestamp representation | OPEN |
| MEASUREMENT-006 | Structured value support | OPEN |
| MEASUREMENT-007 | Unit catalog | OPEN |
| MEASUREMENT-008 | Unit conversion policy | OPEN |
| MEASUREMENT-009 | Baseline required or optional by type | OPEN |
| MEASUREMENT-010 | Target required or optional by type | OPEN |
| MEASUREMENT-011 | Target direction enum | OPEN |
| MEASUREMENT-012 | Range target representation | OPEN |
| MEASUREMENT-013 | Definition versioning | OPEN |
| MEASUREMENT-014 | Latest-value resolution | OPEN |
| MEASUREMENT-015 | Backdated record support | OPEN |
| MEASUREMENT-016 | Historical correction policy | OPEN |
| MEASUREMENT-017 | Duplicate record policy | OPEN |
| MEASUREMENT-018 | Record deletion and retention | OPEN |
| MEASUREMENT-019 | Record source enum and provenance | OPEN |
| MEASUREMENT-020 | Definition lifecycle states | OPEN |
| MEASUREMENT-021 | Archive/restore/delete behavior | OPEN |
| MEASUREMENT-022 | Target modification effect on historical Progress | OPEN — C08 |
| MEASUREMENT-023 | Progress compatibility by value type | OPEN — C08 |
| MEASUREMENT-024 | Review snapshot and retention | OPEN — C09 |

## 23. Definition of Done

C06 core is complete when:
- Measurement definition and Record are distinct domain concepts.
- Goal and ownership validation work through C01/C03.
- Definition and record contracts are explicit.
- All implemented value types have defined validation.
- History and current-value operations follow approved semantics.
- No unapproved unit conversion or versioning is implemented.
- C08/C09 read contracts are documented.
- Unit, negative and integration tests pass.
- Errors follow D03/D06 conventions.
- OPEN decisions are documented.
- No code outside C06 ownership is silently modified.

**Final status:** DETAILED DESIGN — PARTIALLY BLOCKED.
# FLOW-UP — C07 PLANNING & SCHEDULE RULES
## Domain Implementation Specification

**Module:** C07  
**Domain:** Planning & Schedule Rules  
**Status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED  
**Architecture baseline:** Master Blueprint v0.4  
**Depends on:** C01, C05  
**Integrates with:** C03, C08, C09, B10

---

## 1. Purpose

C07 quản lý việc lập kế hoạch và sắp xếp thời gian dự kiến thực hiện Action.

C07 sở hữu:
- Daily Plan.
- Schedule.
- Schedule–Action relationship.
- Daily Plan–User relationship.
- Planned start/end time.
- Rescheduling.
- Schedule retrieval.
- Planning lifecycle.
- Application of approved AI Planning proposals through standard Planning operations.

C07 không sở hữu actual execution data hoặc Progress.

## 2. Scope

### 2.1. In Scope

- Daily Plan identity and ownership.
- Daily Plan date.
- Schedule identity.
- Schedule start/end.
- Schedule–Action relationship.
- Daily Plan–Schedule relationship.
- Schedule CRUD and rescheduling.
- Date and date-range retrieval.
- Time validation.
- Timezone contract.
- Conflict detection contract.
- Planned vs Actual distinction.
- Manual Planning.
- AI-assisted Planning compatibility.
- Validation and domain invariants.

### 2.2. Out of Scope

C07 không:
- Tạo hoặc sở hữu Action.
- Ghi nhận actual execution.
- Tự chuyển Action sang IN_PROGRESS hoặc COMPLETED dựa trên thời gian.
- Tính Progress.
- Quản lý Review.
- Tự quyết định recurrence nếu chưa được duyệt.
- Cho AI ghi trực tiếp vào official Planning data.
- Tự thay đổi Action lifecycle khi Schedule bị xóa hoặc đổi giờ.

## 3. Approved Planning Decisions

| Decision | Description | Status |
|---|---|---|
| DEC-012 | Manual Planning and AI-assisted Planning share one Planning model | APPROVED |
| DEC-013 | Basic AI Daily Plan proposal is included in MVP | APPROVED |
| DEC-014 | AI proposals do not become official data before User approval | APPROVED |

Các quyết định này là baseline bắt buộc.

DEC-021 về AI provider/model selection vẫn OPEN và không thuộc quyền quyết định của C07.

## 4. Domain Ownership

| Resource / Rule | Owner |
|---|---|
| User ownership | C01 |
| Goal | C03 |
| Action | C05 |
| Daily Plan | C07 |
| Schedule | C07 |
| Actual execution | C05 |
| Authoritative Progress | C08 |
| Review | C09 |
| AI proposal orchestration | B10 |
| Persistence | D01 |
| Shared contracts | D03 |
| Validation infrastructure | D04 |
| Error mapping | D06 |

C07 sở hữu Planned Planning data.

C05 sở hữu Actual Execution data.

B10 điều phối AI proposal; C07 sở hữu official Planning model và application rules.

## 5. Planning Concepts

### 5.1. Daily Plan

Daily Plan là tập hợp các Schedule entries được tổ chức theo ngày cho một User.

Daily Plan không phải:
- Goal.
- Milestone.
- Action.
- Review.
- Actual execution report.

### 5.2. Schedule

Schedule biểu diễn thời gian dự kiến thực hiện một Action.

Schedule là dữ liệu kế hoạch, không phải bằng chứng Action đã được thực hiện.

### 5.3. Planned Work

Planned work là các Action được sắp xếp vào một khoảng thời gian dự kiến.

Không đồng nhất planned work với actual work.

## 6. Daily Plan Model

Logical model:

| Field | Meaning | Status |
|---|---|---|
| id | Daily Plan identity | Required |
| user_id | Owning User | Required |
| date | Planning calendar date | Required |
| status | Daily Plan lifecycle | OPEN |
| created_at | Creation timestamp | Required |
| updated_at | Last update timestamp | Required |
| archived_at | Archive timestamp | OPEN |

Logical model không phải database schema cuối cùng.

### 6.1. Ownership

Daily Plan thuộc một User.

C01 xác minh User identity và access.

Không suy ra Daily Plan ownership từ Action hoặc Goal.

### 6.2. Date

`date` là ngày lập kế hoạch theo local calendar semantics.

Phải phân biệt:
- Calendar date.
- UTC instant.
- Local date-time.
- Zoned date-time.

Không lưu date-only concept như một instant tùy tiện làm thay đổi ngày khi chuyển timezone.

### 6.3. Cardinality

OPEN:
- Một Daily Plan cho mỗi User mỗi ngày?
- Có nhiều Daily Plan trong cùng ngày?
- Có hỗ trợ nhiều loại plan?
- Có cho phép tạo Daily Plan rỗng?

Không tự đặt unique constraint cho `user_id + date` nếu chưa được duyệt.

### 6.4. Empty Daily Plan

OPEN:
- Daily Plan rỗng có tồn tại không?
- Có tự tạo Daily Plan khi User mở trang ngày mới không?
- Daily Plan chỉ tồn tại khi có Schedule hay không?

Không tự động tạo hàng loạt Daily Plan.

## 7. Schedule Model

Logical model:

| Field | Meaning | Status |
|---|---|---|
| id | Schedule identity | Required |
| action_id | Scheduled Action | Required |
| daily_plan_id | Associated Daily Plan | OPEN |
| start_at | Planned start | Required |
| end_at | Planned end | Required |
| status | Schedule lifecycle | OPEN |
| created_at | Creation timestamp | Required |
| updated_at | Last update timestamp | Required |
| archived_at | Archive timestamp | OPEN |

### 7.1. Action Association

Mỗi Schedule phải tham chiếu một Action hợp lệ.

C05 sở hữu Action.

C07 xác minh Action qua C05 contract.

### 7.2. Daily Plan Association

Schedule có thể gắn với Daily Plan theo thiết kế hiện tại, nhưng việc association có bắt buộc hay không vẫn OPEN.

Nếu có `daily_plan_id`:
- Daily Plan phải tồn tại.
- Daily Plan phải thuộc đúng User.
- Action phải thuộc phạm vi User được phép truy cập.
- Date của Schedule phải tương thích với Daily Plan theo timezone/date policy.

### 7.3. Goal and Milestone Context

Schedule không cần sở hữu `goal_id` hoặc `milestone_id` riêng.

Goal và Milestone được xác định thông qua Action và association contracts của C03/C04/C05.

Không tạo duplicate association fields nếu không có quyết định kiến trúc mới.

## 8. Daily Plan–Schedule Relationship

Logical relationship dự kiến:

`Daily Plan 1 ---- 0..N Schedules`

Tuy nhiên, Schedule có bắt buộc phải thuộc một Daily Plan hay có thể tồn tại độc lập vẫn OPEN.

C07 phải giữ rõ hai khái niệm:
- Schedule: planned time for an Action.
- Daily Plan: User's date-based planning container.

Không đồng nhất Daily Plan với một Schedule duy nhất.

## 9. Scheduling Operations

Logical operations:

### 9.1. Daily Plan

- `createDailyPlan`
- `updateDailyPlan`
- `getDailyPlan`
- `getDailyPlanByDate`
- `getDailyPlansByDateRange`

### 9.2. Schedule

- `createSchedule`
- `updateSchedule`
- `deleteSchedule`
- `moveSchedule`
- `rescheduleAction`
- `getSchedule`
- `getSchedulesByDate`
- `getSchedulesByDateRange`
- `getSchedulesByAction`

### 9.3. Operation Rules

Mỗi mutation phải:
1. Resolve User context.
2. Validate ownership.
3. Validate Action.
4. Validate Daily Plan nếu có.
5. Validate time range.
6. Validate conflict policy nếu đã được duyệt.
7. Execute C07-owned mutation.
8. Return domain result or structured error.

Reschedule không được tạo actual execution record.

## 10. Time Rules

### 10.1. Time Concepts

C07 phải phân biệt:
- Calendar date.
- Local time.
- Timezone.
- UTC instant.
- Duration.

### 10.2. Start and End

Baseline validation:
- Start và end phải là thời điểm hợp lệ.
- End phải sau start.
- Không chấp nhận invalid hoặc ambiguous representation nếu không có cách resolve theo timezone policy.

### 10.3. Timezone

OPEN:
- Timezone lấy từ User profile hay từng Schedule?
- Daily Plan dùng timezone nào?
- Có cho phép User thay đổi timezone không?
- Schedule đã tạo có giữ timezone ban đầu không?
- UTC storage strategy.
- Date boundary behavior.

Không tự hardcode timezone mặc định trong domain logic.

### 10.4. UTC Storage

UTC storage là phương án kỹ thuật cần đánh giá cùng D01.

C07 phải giữ đúng ý nghĩa local planning time.

Không chuyển local date thành UTC date rồi dùng UTC date làm Daily Plan date mà không có quy tắc rõ ràng.

### 10.5. Daylight Saving Time

MVP có thể chưa cần recurrence phức tạp, nhưng time representation không nên giả định mọi timezone đều có offset cố định.

DST policy cần được xác định theo timezone strategy.

## 11. Schedule Conflict Rules

Các trường hợp cần phân biệt:
- Một Action có nhiều Schedule entries.
- Hai Action có Schedule overlap.
- Một Schedule nằm ngoài Daily Plan date.
- Hai Schedule trùng thời điểm.
- Schedule bị reschedule vào khoảng đã có conflict.

OPEN:
- Có cấm overlap giữa các Action không?
- Conflict là warning hay hard validation error?
- Cùng một Action có thể được schedule nhiều lần không?
- Có cho phép Schedule overlap một phần không?
- Có cho phép User override conflict không?

Không tự động từ chối mọi overlap.

### 11.1. Conflict Detection

Có thể xây dựng validation interface để phát hiện overlap mà chưa khóa policy.

Kết quả conflict phải phân biệt:
- Conflict detected.
- Conflict blocking.
- Conflict warning.

Chỉ policy được duyệt mới quyết định operation có bị từ chối không.

## 12. Recurrence Rules

Recurrence là phần chưa được chốt cho MVP.

Các khái niệm cần xem xét:
- Recurrence pattern.
- Recurrence end.
- Exception dates.
- Modify one occurrence.
- Modify entire series.
- Delete one occurrence.
- Delete entire series.

Không tự triển khai recurring series hoặc recurrence engine.

Nếu MVP không có recurrence, core Schedule phải hoạt động độc lập mà không phụ thuộc recurrence abstractions.

## 13. Planning Lifecycle

### 13.1. Daily Plan

Các lifecycle concepts:
- Create.
- Update.
- Close/complete.
- Archive.
- Restore.
- Delete.

Daily Plan status enum và transition graph vẫn OPEN.

### 13.2. Schedule

Các lifecycle concepts:
- Create.
- Update.
- Reschedule.
- Delete.
- Archive.

Không tự coi Schedule đã kết thúc về mặt thời gian là completed.

### 13.3. Historical Schedule

OPEN:
- Có giữ Schedule đã qua không?
- Delete có phải hard delete không?
- Có cần Schedule change history không?
- Review có dùng historical Schedule snapshot không?

Không xóa lịch sử khi reschedule nếu chưa có policy.

## 14. Planned vs Actual Time

| Concept | Owner | Meaning |
|---|---|---|
| Planned start | C07 | Expected start |
| Planned end | C07 | Expected end |
| Planned duration | C07-derived | Duration between planned times |
| Actual start | C05 | Actual execution start |
| Actual completion | C05 | Actual execution completion |
| Actual duration | C05 | Actual execution duration |
| Progress | C08 | Authoritative progress result |

### Rules

- Planned start không phải actual start.
- Planned end không phải actual completion.
- Planned duration không phải actual duration.
- Schedule start time không tự chuyển Action sang IN_PROGRESS.
- Schedule end time không tự hoàn thành Action.
- Missed Schedule không đồng nghĩa Action bị cancelled.
- Delayed execution không tự thay đổi Action lifecycle.
- Partial execution thuộc C05.
- C07 không tự ghi actual execution data.

## 15. AI-assisted Planning Compatibility

### 15.1. Approved Architecture

Theo DEC-012:
- Manual Planning và AI-assisted Planning dùng chung một Planning model.

Theo DEC-013:
- Basic AI Daily Plan proposal nằm trong MVP.

Theo DEC-014:
- AI proposal không trở thành official Planning data trước khi User approval.

### 15.2. Separation of Proposal and Official Data

Phải phân biệt:
- AI Planning Proposal.
- Official Daily Plan.
- Official Schedule.

AI proposal không phải Schedule chính thức.

### 15.3. Proposal Application Flow

Logical flow:

1. B10 tạo hoặc điều phối AI Planning Proposal.
2. Proposal được validate.
3. User xem và phê duyệt proposal.
4. Application layer gửi nội dung được duyệt đến C07.
5. C07 validate Action, ownership, date/time và conflict policy.
6. C07 tạo hoặc cập nhật Daily Plan/Schedule qua standard operations.
7. Kết quả được trả về application layer.

C07 không gọi trực tiếp AI provider.

C07 không tự quyết định User approval.

### 15.4. Partial Approval

OPEN:
- User có thể chấp nhận một phần proposal không?
- Có thể chỉnh sửa proposal trước approval không?
- Nếu một Schedule trong proposal không hợp lệ, xử lý cả batch hay từng item?
- Application có cần idempotency để tránh tạo trùng Schedule không?

### 15.5. AI Data Trust Boundary

Không tin tưởng trực tiếp:
- Action IDs từ AI.
- Date/time values từ AI.
- User ownership claims.
- Conflict claims.
- Schedule state claims.

Mọi proposal phải được xác minh lại bởi C07 và các module sở hữu resource tương ứng.

## 16. Domain Invariants

| ID | Invariant |
|---|---|
| C07-INV-001 | Every Schedule references one valid Action |
| C07-INV-002 | Daily Plan belongs to one valid User |
| C07-INV-003 | Schedule ownership is validated through User and Action |
| C07-INV-004 | Daily Plan date follows the approved local-date policy |
| C07-INV-005 | Schedule start/end range is valid |
| C07-INV-006 | Schedule and Daily Plan relationships are consistent |
| C07-INV-007 | Schedule scope follows its Action |
| C07-INV-008 | Planned time is distinct from actual execution |
| C07-INV-009 | Schedule time does not automatically change Action status |
| C07-INV-010 | Schedule mutation does not mutate Action execution records |
| C07-INV-011 | Conflict behavior follows approved policy |
| C07-INV-012 | Recurrence is not assumed without approval |
| C07-INV-013 | AI proposals are not official Planning data before approval |
| C07-INV-014 | Approved AI proposals use standard C07 validation and mutation |
| C07-INV-015 | C07 does not calculate authoritative Progress |
| C07-INV-016 | No unapproved cascade deletion is allowed |

## 17. Operations and Contracts

### 17.1. Daily Plan

- `createDailyPlan`
- `updateDailyPlan`
- `getDailyPlan`
- `getDailyPlanByDate`
- `validateDailyPlanOwnership`
- `validateDailyPlanDate`

### 17.2. Schedule

- `createSchedule`
- `updateSchedule`
- `deleteSchedule`
- `moveSchedule`
- `rescheduleAction`
- `getSchedule`
- `getSchedulesByDate`
- `getSchedulesByDateRange`
- `validateScheduleAction`
- `validateScheduleTimeRange`
- `validateScheduleDailyPlan`

### 17.3. Conflict

- `detectScheduleConflicts`
- `validateScheduleConflicts`

Conflict enforcement is blocked until policy approval.

### 17.4. AI Proposal Application

- `validatePlanningProposal`
- `validateApprovedProposal`
- `applyApprovedPlanningProposal`

These operations must accept an approval result from the application layer; C07 must not fabricate approval.

### 17.5. Contract Requirements

Every operation must:
- Validate ownership.
- Validate Action and Daily Plan references.
- Validate time semantics.
- Follow approved conflict rules.
- Preserve Planned vs Actual separation.
- Return structured domain errors.

## 18. Validation Catalog

| Error code | Meaning |
|---|---|
| DAILY_PLAN_NOT_FOUND | Daily Plan does not exist |
| DAILY_PLAN_ACCESS_DENIED | User cannot access Daily Plan |
| DAILY_PLAN_INVALID_ID | Invalid Daily Plan identifier |
| DAILY_PLAN_USER_REQUIRED | User reference required |
| DAILY_PLAN_OWNER_INVALID | Daily Plan ownership invalid |
| DAILY_PLAN_DATE_INVALID | Invalid planning date |
| DAILY_PLAN_ALREADY_EXISTS | Duplicate Daily Plan under approved cardinality |
| DAILY_PLAN_STATUS_INVALID | Invalid Daily Plan status |
| DAILY_PLAN_DEPENDENCY_CONFLICT | Daily Plan dependency blocks operation |
| SCHEDULE_NOT_FOUND | Schedule does not exist |
| SCHEDULE_ACCESS_DENIED | User cannot access Schedule |
| SCHEDULE_INVALID_ID | Invalid Schedule identifier |
| SCHEDULE_ACTION_REQUIRED | Action reference required |
| SCHEDULE_ACTION_NOT_FOUND | Action does not exist |
| SCHEDULE_ACTION_INVALID | Action cannot be scheduled |
| SCHEDULE_DAILY_PLAN_NOT_FOUND | Daily Plan does not exist |
| SCHEDULE_DAILY_PLAN_INVALID | Daily Plan cannot contain Schedule |
| SCHEDULE_OWNERSHIP_INVALID | Ownership validation failed |
| SCHEDULE_SCOPE_INVALID | Schedule scope conflicts with Action |
| SCHEDULE_START_INVALID | Invalid start time |
| SCHEDULE_END_INVALID | Invalid end time |
| SCHEDULE_TIME_RANGE_INVALID | End must follow start |
| SCHEDULE_TIMEZONE_INVALID | Invalid or unsupported timezone |
| SCHEDULE_DATE_BOUNDARY_INVALID | Schedule conflicts with date policy |
| SCHEDULE_CONFLICT_DETECTED | Overlap detected |
| SCHEDULE_CONFLICT_BLOCKED | Conflict blocks operation under approved policy |
| SCHEDULE_RECURRENCE_INVALID | Invalid recurrence definition |
| SCHEDULE_STATUS_INVALID | Invalid Schedule status |
| SCHEDULE_DELETE_BLOCKED | Deletion not permitted |
| PLANNING_PROPOSAL_INVALID | Invalid proposal |
| PLANNING_PROPOSAL_NOT_APPROVED | Proposal has not been approved |
| PLANNING_PROPOSAL_ACTION_INVALID | Proposal references invalid Action |
| PLANNING_PROPOSAL_TIME_INVALID | Proposal contains invalid time |
| PLANNING_PROPOSAL_CONFLICT | Proposal conflicts with existing Planning data |
| PLANNING_PROPOSAL_APPLICATION_FAILED | Approved proposal could not be applied |
| PLANNING_VALIDATION_FAILED | General validation failure |

Error identifiers must follow D06 shared conventions.

## 19. Cross-Domain Integration

| Module | Interaction |
|---|---|
| C01 | User identity and ownership |
| C03 | Resolve Goal context through Action; no Goal mutation |
| C05 | Validate Action and read actual execution boundary |
| C08 | Supply planned-time facts if required; C08 owns Progress |
| C09 | Supply Planning facts for Review |
| B10 | AI proposal orchestration and approval |
| D01 | Persistence |
| D03 | Shared types and contracts |
| D04 | Validation infrastructure |
| D06 | Error mapping |

C07 must not depend on UI, HTTP request objects, database drivers or AI provider implementations.

## 20. Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| C07-AC-001 | Daily Plan has stable identity |
| C07-AC-002 | Daily Plan belongs to one valid User |
| C07-AC-003 | Daily Plan date follows agreed date semantics |
| C07-AC-004 | Schedule has stable identity |
| C07-AC-005 | Schedule references one valid Action |
| C07-AC-006 | Schedule ownership is validated |
| C07-AC-007 | Schedule start/end are valid |
| C07-AC-008 | End must be after start |
| C07-AC-009 | Daily Plan association follows approved cardinality |
| C07-AC-010 | Schedule can be retrieved by date |
| C07-AC-011 | Schedule can be retrieved by date range |
| C07-AC-012 | Reschedule preserves Schedule identity unless an approved policy says otherwise |
| C07-AC-013 | Schedule does not mutate Action execution data |
| C07-AC-014 | Planned and actual timestamps remain distinct |
| C07-AC-015 | Schedule time does not automatically change Action status |
| C07-AC-016 | Conflict handling follows approved policy |
| C07-AC-017 | Recurrence is not silently introduced |
| C07-AC-018 | Manual Planning uses official Planning model |
| C07-AC-019 | AI proposal remains separate before approval |
| C07-AC-020 | Approved proposal is revalidated before application |
| C07-AC-021 | AI proposal application uses standard C07 operations |
| C07-AC-022 | C07 does not calculate authoritative Progress |
| C07-AC-023 | No unapproved cascade deletion is executed |
| C07-AC-024 | Domain errors follow D06 conventions |

## 21. Testing Requirements

### Unit Tests
- Daily Plan ownership.
- Daily Plan date validation.
- Schedule Action reference.
- Schedule time range.
- Timezone validation.
- Schedule date resolution.
- Conflict detection.
- Proposal validation.
- Proposal approval guard.

### Integration Tests
- C01 + C07: User ownership.
- C05 + C07: Action association and planned/actual separation.
- C07 + C08: Planning facts read contract.
- C07 + C09: Review data contract.
- B10 + C07: approved AI proposal application.

### Negative Tests
- Inaccessible User context.
- Missing Action.
- Inaccessible Action.
- Invalid time range.
- Invalid timezone.
- Daily Plan mismatch.
- Conflict under blocking policy.
- Unapproved proposal.
- Proposal referencing invalid Action.
- Duplicate proposal application if idempotency is supported.

### Invariant Tests
- Reschedule does not create actual execution.
- Schedule time does not complete Action.
- AI proposal cannot bypass approval.
- Approved proposal still passes standard validation.
- C07 never mutates Action execution data or Progress.

## 22. Implementation Boundaries

### Ready for Core Implementation
- Daily Plan logical model.
- Schedule logical model.
- User ownership validation.
- Action validation through C05.
- Create/update/retrieval operations.
- Start/end validation.
- Date and date-range query contracts.
- Planned vs Actual separation.
- Manual Planning.
- AI proposal separation and approval boundary.
- Standard proposal application validation.

### Partially Blocked
- One vs multiple Daily Plans per User/day.
- Empty Daily Plan behavior.
- Schedule-to-Daily Plan required/optional.
- Timezone source and UTC strategy.
- DST and date-boundary rules.
- Schedule overlap enforcement.
- Multiple Schedule entries per Action.
- Schedule lifecycle and historical retention.
- Recurrence.
- AI partial approval.
- Proposal idempotency and batch failure strategy.
- Action archive/delete effects on Schedule.

Do not make permanent cardinality, timezone or conflict decisions without approval.

## 23. Implementation Task Breakdown

| Task ID | Task | Dependency |
|---|---|---|
| C07-IMP-001 | Inspect repository and domain conventions | None |
| C07-IMP-002 | Inspect C01/C05 contracts | C01, C05 |
| C07-IMP-003 | Define Daily Plan logical model | C07-IMP-001 |
| C07-IMP-004 | Define Schedule logical model | C07-IMP-001 |
| C07-IMP-005 | Define domain errors | D06 |
| C07-IMP-006 | Implement User ownership validation | C01 |
| C07-IMP-007 | Implement Action validation | C05 |
| C07-IMP-008 | Implement Daily Plan validation | C07-IMP-003 |
| C07-IMP-009 | Implement Schedule time validation | C07-IMP-004 |
| C07-IMP-010 | Implement Daily Plan create/update/retrieval | C07 core |
| C07-IMP-011 | Implement Schedule create/update/retrieval | C07 core |
| C07-IMP-012 | Implement date and date-range queries | C07 core |
| C07-IMP-013 | Implement reschedule preserving identity | C07 core |
| C07-IMP-014 | Define timezone contract | Timezone decision |
| C07-IMP-015 | Define conflict detection contract | Conflict policy |
| C07-IMP-016 | Define recurrence boundary | Recurrence decision |
| C07-IMP-017 | Define AI proposal validation contract | B10 |
| C07-IMP-018 | Implement approved proposal application | DEC-012–014 |
| C07-IMP-019 | Define C08/C09 read contracts | C08, C09 |
| C07-IMP-020 | Write unit and negative tests | C07 core |
| C07-IMP-021 | Write cross-domain integration tests | C01, C05, B10 |
| C07-IMP-022 | Verify Planned vs Actual separation | C05 |
| C07-IMP-023 | Document unresolved decisions | All |

## 24. OPEN Decisions

| ID | Decision | Status |
|---|---|---|
| PLANNING-001 | One Daily Plan per User per day? | OPEN |
| PLANNING-002 | Multiple Daily Plans per day? | OPEN |
| PLANNING-003 | Empty Daily Plan behavior | OPEN |
| PLANNING-004 | Daily Plan automatic creation | OPEN |
| PLANNING-005 | Daily Plan lifecycle states | OPEN |
| PLANNING-006 | Schedule must belong to Daily Plan? | OPEN |
| PLANNING-007 | Multiple Schedules per Action? | OPEN |
| PLANNING-008 | Schedule timezone source | OPEN |
| PLANNING-009 | UTC storage strategy | OPEN |
| PLANNING-010 | Local date boundary behavior | OPEN |
| PLANNING-011 | DST handling | OPEN |
| PLANNING-012 | Schedule overlap policy | OPEN |
| PLANNING-013 | Conflict warning vs hard rejection | OPEN |
| PLANNING-014 | Same Action overlapping Schedules | OPEN |
| PLANNING-015 | Schedule historical retention | OPEN |
| PLANNING-016 | Schedule archive/delete effects | OPEN |
| PLANNING-017 | Recurrence in MVP | OPEN |
| PLANNING-018 | Recurrence exception model | OPEN |
| PLANNING-019 | AI partial approval | OPEN |
| PLANNING-020 | AI proposal batch failure strategy | OPEN |
| PLANNING-021 | Proposal application idempotency | OPEN |
| PLANNING-022 | Action archive/delete effect on Schedule | OPEN — C05 |
| PLANNING-023 | Schedule facts used in Progress | OPEN — C08 |
| PLANNING-024 | Planning history used in Review | OPEN — C09 |

## 25. Definition of Done

C07 core is complete when:
- Daily Plan and Schedule are distinct domain concepts.
- User ownership and Action validation work through C01/C05.
- Create/update/retrieval operations are tested.
- Time range validation works.
- Planned and Actual data are strictly separated.
- Manual Planning works through the official Planning model.
- AI proposal cannot become official before approval.
- Approved proposal application reuses standard validation and operations.
- No unapproved recurrence, conflict or timezone policy is implemented.
- C08/C09 integration boundaries are documented.
- Unit, negative and integration tests pass.
- Errors follow D03/D06 conventions.
- OPEN decisions are documented.
- No code outside C07 ownership is silently modified.

**Final status:** READY FOR IMPLEMENTATION — CORE SCOPE / PARTIALLY BLOCKED.
# FLOW-UP — C08 PROGRESS RULES
## Domain Implementation Specification

**Module:** C08  
**Domain:** Progress Rules  
**Status:** DETAILED DESIGN — PARTIALLY BLOCKED  
**Architecture baseline:** Master Blueprint v0.4  
**Depends on:** C03, C05, C06  
**Integrates with:** C04, C07, C09

---

## 1. Purpose

C08 là module duy nhất chịu trách nhiệm xác định và tính toán Progress chính thức trong FLOW-UP.

C08 chuyển đổi dữ liệu nguồn từ các domain thành các kết quả phản ánh mức độ tiến triển của Goal và các phạm vi liên quan.

C08 chịu trách nhiệm:
- Định nghĩa Progress metrics.
- Tính Measurement Progress.
- Tính Action Completion.
- Tổng hợp Goal Progress.
- Tổng hợp Child Goal Progress.
- Tổng hợp Project Progress nếu được đưa vào MVP.
- Xác định khả năng tính Progress khi thiếu dữ liệu.
- Quản lý calculation result và Progress history theo policy được duyệt.
- Cung cấp authoritative Progress cho C09 và các application clients.

## 2. Scope

### 2.1. In Scope

- Progress calculation rules.
- Measurement-based Progress.
- Action-based Progress.
- Goal Progress.
- Child Goal aggregation.
- Project Progress, nếu được duyệt.
- Progress availability.
- Missing and insufficient data handling.
- Weighting and normalization.
- Progress boundaries and precision.
- Calculation metadata.
- Progress history contract.
- Source data validation.
- Recalculation policy.
- Read contracts for C09 and other consumers.

### 2.2. Out of Scope

C08 không:
- Sở hữu Goal, Action, Measurement hoặc Schedule.
- Tự sửa dữ liệu nguồn.
- Tự thay đổi Goal/Action lifecycle.
- Tự hoàn thành Goal dựa trên Progress.
- Quản lý Measurement definitions hoặc records.
- Quản lý Action execution.
- Quản lý Review.
- Tính lại Progress độc lập trong UI.
- Cho phép AI tự ghi authoritative Progress.
- Tự đặt công thức hoặc trọng số chưa được Product Owner phê duyệt.

## 3. Domain Ownership

| Resource / Rule | Owner |
|---|---|
| Goal and hierarchy | C03 |
| Milestone | C04 |
| Action and execution | C05 |
| Measurement definitions and records | C06 |
| Planning and Schedule | C07 |
| Authoritative Progress | C08 |
| Review | C09 |
| Persistence | D01 |
| Shared types | D03 |
| Validation infrastructure | D04 |
| Error mapping | D06 |

C08 sở hữu business meaning của Progress.

C08 có quyền đọc dữ liệu domain nguồn nhưng không được mutation resource thuộc domain khác.

## 4. Progress Concepts

### 4.1. Progress Definition

Progress Definition là tập hợp quy tắc xác định cách một loại dữ liệu nguồn đóng góp vào kết quả Progress.

### 4.2. Progress Metric

Progress Metric là một chỉ số kết quả, ví dụ:
- Measurement Progress.
- Action Completion Ratio.
- Goal Progress.
- Child Goal Aggregation.
- Project Progress.

Các ví dụ này là categories cần hỗ trợ, không đồng nghĩa tất cả công thức đã được duyệt.

### 4.3. Progress Source

Progress Source là dữ liệu đầu vào từ domain sở hữu dữ liệu đó.

| Source | Owner |
|---|---|
| Goal attributes and hierarchy | C03 |
| Milestone facts, if applicable | C04 |
| Action status and eligibility facts | C05 |
| Measurement definitions and values | C06 |
| Schedule/planned facts, if applicable | C07 |

### 4.4. Progress Value

Progress Value là kết quả của một calculation theo rule đã được duyệt.

Không mặc định mọi Progress Value đều là phần trăm.

Representation, precision và unit của kết quả phải được thống nhất trong shared contract.

### 4.5. Progress Scope

Progress có thể được tính cho:
- Một Measurement.
- Một Goal.
- Một Parent Goal.
- Một Project.
- Một summary scope nếu được định nghĩa.

### 4.6. Calculation Result

Một Calculation Result cần phân biệt:
- Kết quả có thể tính được.
- Kết quả chưa đủ dữ liệu.
- Kết quả không áp dụng.
- Kết quả không hợp lệ do source data hoặc configuration.

Không biểu diễn mọi trường hợp bằng một số duy nhất.

## 5. Progress Result Model

Logical result contract:

| Field | Meaning | Status |
|---|---|---|
| scope_type | Measurement/Goal/Project/... | Proposed |
| scope_id | Identity of calculated scope | Required concept |
| metric_type | Type of Progress metric | Required concept |
| value | Calculated result | Conditional |
| unit | Result unit/representation | OPEN |
| availability | Availability state | Proposed |
| calculated_at | Calculation timestamp | Required concept |
| source_references | Source data references | Required concept |
| rule_version | Rule version used | OPEN |
| explanation | Calculation explanation or metadata | Optional |
| status | Calculation result state | OPEN |

Đây là logical contract, không phải database schema cuối cùng.

### 5.1. Availability

Cần phân biệt ít nhất về mặt semantics:

- `AVAILABLE`: đủ dữ liệu để tính.
- `INSUFFICIENT_DATA`: thiếu dữ liệu cần thiết.
- `NOT_APPLICABLE`: metric không áp dụng cho scope.
- `INVALID_SOURCE`: source data không hợp lệ.

Các tên trên là proposed contract labels, chưa phải enum chính thức.

### 5.2. Undefined vs Zero

- `0` là một kết quả hợp lệ nếu công thức và dữ liệu thực sự cho kết quả zero.
- `undefined` là trường hợp không có kết quả hợp lệ.
- `INSUFFICIENT_DATA` không được chuyển thành zero.
- `NOT_APPLICABLE` không được xem là zero.
- `INVALID_SOURCE` không được âm thầm bỏ qua.

## 6. Measurement Progress

### 6.1. Source

C06 cung cấp:
- Measurement value type.
- Baseline.
- Target.
- Target direction.
- Current value.
- Historical values khi cần.

C08 chịu trách nhiệm diễn giải các dữ liệu này theo Progress rules.

### 6.2. Numeric Measurement

Các trường hợp cần hỗ trợ:
- Increasing target.
- Decreasing target.
- Baseline-based calculation.
- Missing baseline.
- Missing target.
- Current value chưa tồn tại.
- Current value không hợp lệ.

Công thức cụ thể vẫn OPEN.

Không tự mặc định công thức:

`(current - baseline) / (target - baseline)`

Đây chỉ là một khả năng thiết kế cần được Product Owner duyệt.

### 6.3. Boolean Measurement

C08 cần xác định:
- Điều kiện true có tương đương 100% không?
- False có tương đương 0% không?
- Có hỗ trợ trạng thái chưa ghi nhận không?
- Có hỗ trợ nhiều lần ghi nhận Boolean không?

Chưa có quyết định thì không tự áp dụng phép chuyển đổi Boolean sang phần trăm.

### 6.4. Range Target

Nếu Measurement sử dụng target range:
- Phải xác định range boundary.
- Phải xác định giá trị trong range có được xem là đạt mục tiêu hay không.
- Phải xác định cách đánh giá ngoài range.
- Phải xác định boundary inclusive/exclusive.

Không tự chọn các quy tắc này.

### 6.5. Unsupported Measurement Types

Nếu value type không có Progress compatibility:
- Không tính bằng cách ép kiểu.
- Không tự chuyển text hoặc structured value thành số.
- Trả về trạng thái không hỗ trợ hoặc invalid theo error contract đã duyệt.
- Không làm hỏng toàn bộ Goal calculation nếu policy cho phép xử lý source không áp dụng.

## 7. Action Completion

### 7.1. Source

C05 cung cấp:
- Action identity.
- Action status.
- Action lifecycle facts.
- Cancellation/archival information nếu có.
- Execution facts nếu calculation policy cần.

### 7.2. Action Eligibility

C08 phải xác định tập Action đủ điều kiện tham gia Action Completion.

OPEN:
- TODO có được tính không?
- IN_PROGRESS có được tính không?
- COMPLETED có được tính không?
- CANCELLED có bị loại không?
- ARCHIVED có bị loại không?
- Deleted Action có được giữ trong historical calculation không?
- Action thuộc Milestone có được tính cùng Action trực tiếp của Goal không?

Không tự quyết định eligibility.

### 7.3. Completion Ratio

C08 cần hỗ trợ khái niệm:

`Completed Eligible Actions / Total Eligible Actions`

Nhưng đây mới là dạng công thức khái niệm.

Cần được duyệt:
- Tử số.
- Mẫu số.
- Action eligibility.
- Empty set behavior.
- Precision và rounding.

### 7.4. Empty Action Set

Không tự trả về 0% khi không có Action.

Empty set có thể mang nghĩa:
- Không có Action để đánh giá.
- Action metric không áp dụng.
- Insufficient data.
- Một kết quả đặc biệt theo policy.

Phải có quyết định rõ ràng.

## 8. Goal Progress

### 8.1. Sources

Goal Progress có thể nhận dữ liệu từ:
- Measurement Progress.
- Action Completion.
- Child Goal Progress.

Không phải Goal nào cũng có đầy đủ ba nguồn.

### 8.2. Source Availability

C08 phải xử lý các trường hợp:
- Goal không có Measurement.
- Goal không có Action.
- Goal không có Child Goal.
- Một nguồn có dữ liệu, nguồn khác thiếu.
- Tất cả nguồn đều thiếu.
- Source không hợp lệ.
- Source không áp dụng cho Goal.

### 8.3. Combination

Không tự cộng hoặc trung bình các nguồn.

Phải có combination policy được duyệt xác định:
- Nguồn nào được tính.
- Nguồn nào không được tính.
- Trọng số.
- Normalization.
- Missing source behavior.
- Empty source behavior.

### 8.4. Goal Progress Availability

Goal Progress có thể không có giá trị tính toán hợp lệ nếu thiếu dữ liệu cần thiết.

Không ép mọi Goal phải có phần trăm Progress ngay từ khi tạo.

## 9. Progress Weighting and Combination

Các mô hình cần xem xét:

- Equal weighting.
- Configurable weighting.
- Measurement-based weighting.
- Action-based weighting.
- Child Goal weighting.
- Combination of multiple categories.

Tất cả đều là phương án cần Product Owner phê duyệt.

### 9.1. Weight Validation

Nếu configurable weighting được duyệt:
- Weight phải nằm trong valid range.
- Không chấp nhận giá trị âm.
- Phải xác định tổng weight có bắt buộc bằng 1 hoặc 100% không.
- Phải xác định normalization.
- Phải xác định xử lý nguồn thiếu.

### 9.2. Missing Source Handling

Không:
- Tự gán weight bằng zero.
- Tự gán source thiếu bằng zero.
- Tự redistribute weight.
- Tự bỏ source thiếu.

Chỉ thực hiện theo approved combination policy.

## 10. Child Goal Aggregation

### 10.1. Hierarchy Source

C03 sở hữu Goal hierarchy.

C08 chỉ đọc quan hệ Parent–Child đã được C03 xác thực.

### 10.2. Aggregation

Các vấn đề cần phê duyệt:
- Aggregate direct children hay toàn bộ descendants?
- Recursive aggregation có được dùng không?
- Child Goal weighting.
- Child Goal không có Progress.
- Child Goal archived.
- Child Goal completed.
- Parent Goal không có Child Goal.
- Child Goal có nhiều nguồn Progress khác nhau.

### 10.3. Hierarchy Validity

Nếu hierarchy không hợp lệ:
- Không tự tính recursive Progress.
- Phát hiện cycle hoặc invalid relationship.
- Trả về domain error hoặc invalid availability.
- Không tạo kết quả sai do recursive loop.

### 10.4. Parent and Child Independence

Không tự thay đổi status của Parent hoặc Child dựa trên Progress.

Goal lifecycle vẫn thuộc C03.

## 11. Project Progress

Project Progress là một metric cần xem xét, nhưng chưa phải behavior đã được duyệt đầy đủ.

Cần xác định:
- Project lấy Goal trực tiếp hay gồm cả descendants?
- Goal độc lập ngoài Project có bị loại?
- Completed Goal có được tính?
- Archived Goal có được tính?
- Empty Project trả về gì?
- Goal không có Progress xử lý thế nào?
- Project lifecycle ảnh hưởng Progress ra sao?

C02 sở hữu Project; C03 sở hữu Goal; C08 chỉ tổng hợp dữ liệu.

Không tạo Project Progress formula trong C02/C03.

## 12. Progress Boundaries and Precision

### 12.1. Boundaries

Nếu Progress được biểu diễn bằng percentage, cần xác định:
- Minimum.
- Maximum.
- Có cho phép dưới 0% không?
- Có cho phép trên 100% không?
- Có cap kết quả không?
- Có giữ raw value và display value riêng không?

Không tự clamp kết quả nếu chưa được duyệt.

### 12.2. Precision

Cần định nghĩa:
- Internal calculation precision.
- Rounding mode.
- Display precision.
- Comparison precision.

Không làm tròn sớm trong quá trình aggregation nếu làm thay đổi kết quả.

### 12.3. Invalid Values

Không âm thầm sửa:
- NaN.
- Infinity.
- Invalid weights.
- Invalid target.
- Invalid source values.

## 13. Progress History

### 13.1. History Concepts

Progress History có thể chứa:
- Calculation timestamp.
- Scope.
- Result.
- Source references.
- Rule version.
- Calculation metadata.

### 13.2. Snapshot vs Dynamic Calculation

OPEN:
- Mỗi lần đọc có tính lại không?
- Có persist snapshot không?
- Có lưu lịch sử mỗi lần source thay đổi không?
- Có cần manual refresh không?
- Có cache không?
- Cache invalidation thế nào?

Không tự triển khai snapshot persistence hoặc event-driven recalculation khi chưa có policy.

### 13.3. Reproducibility

Progress calculation cần có khả năng giải thích và tái lập theo source data và rules đã sử dụng.

Nếu source data thay đổi:
- Historical result không được âm thầm ghi đè nếu snapshot policy yêu cầu giữ lịch sử.
- Recalculation phải tuân thủ approved policy.
- Rule version phải được xác định nếu formula có thể thay đổi theo thời gian.

## 14. Progress and Lifecycle Interaction

| Source event | C08 responsibility |
|---|---|
| Goal completed | Recalculate only according to approved policy |
| Goal reopened | Recalculate only according to approved policy |
| Action completed | Update relevant Progress calculation |
| Action reopened | Follow approved eligibility/history policy |
| Action cancelled | Follow eligibility policy |
| Action archived | Follow eligibility policy |
| Measurement value recorded | Recalculate according to policy |
| Measurement target changed | Follow target history policy |
| Goal hierarchy changed | Recalculate affected hierarchy scopes |
| Project Goal collection changed | Recalculate Project scope if supported |

C08 không thực hiện lifecycle mutation.

## 15. Domain Invariants

| ID | Invariant |
|---|---|
| C08-INV-001 | C08 is the sole owner of authoritative Progress calculations |
| C08-INV-002 | Every calculation uses valid source data |
| C08-INV-003 | Calculation follows approved formula and combination policy |
| C08-INV-004 | Missing data is not silently interpreted as zero |
| C08-INV-005 | Undefined is distinct from zero |
| C08-INV-006 | Insufficient data is distinct from invalid source |
| C08-INV-007 | Action eligibility follows approved policy |
| C08-INV-008 | Measurement compatibility follows approved policy |
| C08-INV-009 | Goal hierarchy is validated before recursive aggregation |
| C08-INV-010 | Weights follow approved normalization rules |
| C08-INV-011 | Progress does not automatically mutate Goal/Action status |
| C08-INV-012 | UI does not calculate authoritative Progress independently |
| C08-INV-013 | Historical results follow approved persistence policy |
| C08-INV-014 | Calculation metadata identifies relevant source data |
| C08-INV-015 | Invalid calculations do not return fabricated numeric results |
| C08-INV-016 | C08 does not mutate source domain resources |

## 16. Operations and Contracts

Logical operations:

### 16.1. Measurement Progress

- `calculateMeasurementProgress`
- `getMeasurementProgress`
- `validateMeasurementProgressSources`

### 16.2. Action Completion

- `calculateActionCompletion`
- `getActionCompletion`
- `resolveEligibleActions`

### 16.3. Goal Progress

- `calculateGoalProgress`
- `getGoalProgress`
- `validateGoalProgressSources`

### 16.4. Hierarchy and Project

- `calculateChildGoalProgress`
- `calculateProjectProgress` — subject to approval.
- `getProgressSummary`

### 16.5. History

- `getProgressHistory`
- `recalculateProgress`
- `resolveProgressSources`

### 16.6. Contract Requirements

Every calculation must:
1. Resolve target scope.
2. Retrieve source facts through owning module contracts.
3. Validate source availability and consistency.
4. Apply only approved calculation rules.
5. Return a result with explicit availability.
6. Include calculation metadata required by the contract.
7. Avoid mutation of source domains.

## 17. Validation Catalog

| Error code | Meaning |
|---|---|
| PROGRESS_SCOPE_INVALID | Invalid calculation scope |
| PROGRESS_SCOPE_NOT_FOUND | Scope does not exist |
| PROGRESS_SOURCE_MISSING | Required source is missing |
| PROGRESS_SOURCE_INVALID | Source data is invalid |
| PROGRESS_SOURCE_INCOMPATIBLE | Source cannot be used by this metric |
| PROGRESS_MEASUREMENT_INVALID | Measurement source invalid |
| PROGRESS_MEASUREMENT_TYPE_UNSUPPORTED | Measurement type unsupported |
| PROGRESS_BASELINE_INVALID | Invalid baseline |
| PROGRESS_TARGET_INVALID | Invalid target |
| PROGRESS_ACTION_ELIGIBILITY_INVALID | Action eligibility cannot be resolved |
| PROGRESS_ACTION_SET_EMPTY | No eligible Actions under current policy |
| PROGRESS_HIERARCHY_INVALID | Invalid Goal hierarchy |
| PROGRESS_HIERARCHY_CYCLE | Goal hierarchy contains a cycle |
| PROGRESS_WEIGHT_INVALID | Invalid weight |
| PROGRESS_WEIGHT_NORMALIZATION_FAILED | Weight normalization failed |
| PROGRESS_AGGREGATION_INVALID | Invalid aggregation input |
| PROGRESS_RESULT_UNAVAILABLE | Progress result unavailable |
| PROGRESS_RESULT_OUT_OF_RANGE | Result outside approved boundaries |
| PROGRESS_PRECISION_INVALID | Invalid precision configuration |
| PROGRESS_HISTORY_NOT_FOUND | Progress history not found |
| PROGRESS_RECALCULATION_FAILED | Recalculation failed |
| PROGRESS_RULE_UNAVAILABLE | No approved calculation rule |
| PROGRESS_VALIDATION_FAILED | General validation failure |

Error identifiers must follow D06 conventions.

## 18. Cross-Domain Integration

| Module | Interaction |
|---|---|
| C03 | Read Goal and hierarchy |
| C04 | Read Milestone facts if Milestone Progress is approved |
| C05 | Read Action status and execution facts |
| C06 | Read Measurement definitions and records |
| C07 | Read Planning facts only if approved Progress rules require them |
| C09 | Supply authoritative Progress results |
| D01 | Persist results/history if approved |
| D03 | Shared Progress contracts |
| D04 | Validation infrastructure |
| D06 | Error mapping |

C08 must not depend on UI, HTTP transport, database drivers or AI provider implementations.

## 19. Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| C08-AC-001 | C08 is the sole authoritative Progress calculation owner |
| C08-AC-002 | Measurement Progress uses only supported and validated Measurement data |
| C08-AC-003 | Unsupported Measurement types are not silently coerced |
| C08-AC-004 | Missing baseline is not treated as zero |
| C08-AC-005 | Missing target is not treated as zero |
| C08-AC-006 | Action eligibility follows approved policy |
| C08-AC-007 | Empty eligible Action set follows explicit policy |
| C08-AC-008 | Goal Progress uses only approved sources |
| C08-AC-009 | Missing Goal Progress sources are handled explicitly |
| C08-AC-010 | Weighting follows approved policy |
| C08-AC-011 | Weight normalization follows approved policy |
| C08-AC-012 | Child Goal aggregation validates hierarchy |
| C08-AC-013 | Invalid hierarchy cannot cause recursive calculation failure |
| C08-AC-014 | Project Progress is implemented only if approved |
| C08-AC-015 | Zero is distinct from undefined |
| C08-AC-016 | Insufficient data is distinguishable from invalid data |
| C08-AC-017 | Progress boundaries follow approved rules |
| C08-AC-018 | Calculation precision follows approved policy |
| C08-AC-019 | Historical results follow approved snapshot policy |
| C08-AC-020 | Recalculation follows approved policy |
| C08-AC-021 | Progress does not automatically change Goal/Action status |
| C08-AC-022 | UI does not independently calculate authoritative Progress |
| C08-AC-023 | C09 receives authoritative Progress through a defined contract |
| C08-AC-024 | Domain errors follow D06 conventions |

## 20. Testing Requirements

### Unit Tests
- Numeric Measurement calculation after formula approval.
- Boolean Measurement calculation after formula approval.
- Increasing/decreasing target.
- Range target.
- Missing baseline/target.
- Action eligibility.
- Empty Action set.
- Goal source combination.
- Weight validation.
- Hierarchy aggregation.
- Boundary and precision.
- Availability state.

### Integration Tests
- C03 + C08: Goal and hierarchy.
- C05 + C08: Action completion.
- C06 + C08: Measurement Progress.
- C04 + C08: Milestone contribution if approved.
- C02/C03 + C08: Project Progress if approved.
- C08 + C09: authoritative Progress read contract.

### Negative Tests
- Invalid source data.
- Unsupported Measurement type.
- Missing required target.
- Invalid hierarchy.
- Cycle in hierarchy.
- Invalid weight.
- Empty source set.
- NaN/Infinity.
- Invalid result boundaries.
- Unapproved formula invocation.

### Invariant Tests
- Missing data never silently becomes zero.
- UI/application cannot create a competing Progress formula.
- C08 does not mutate source domain data.
- Calculation is reproducible under the approved source/rule snapshot.
- Goal/Action lifecycle does not change automatically.

## 21. Implementation Boundaries

### Ready for Core Implementation
- Progress result contract.
- Availability/undefined semantics.
- Source reference contract.
- Source validation interfaces.
- Calculation metadata structure.
- Domain error structure.
- Read contract for C09.
- Test scaffolding for invariant enforcement.

### Partially Blocked
- Measurement formulas.
- Action eligibility and completion ratio.
- Goal combination formula.
- Weighting.
- Missing-source behavior within aggregation.
- Child Goal aggregation.
- Project Progress.
- Boundaries and rounding.
- History snapshot persistence.
- Recalculation triggers.
- Rule versioning.
- Lifecycle interaction.

Không triển khai công thức giả định để làm cho Progress luôn hiển thị số.

## 22. Implementation Task Breakdown

| Task ID | Task | Dependency |
|---|---|---|
| C08-IMP-001 | Inspect repository and domain conventions | None |
| C08-IMP-002 | Inspect C03/C05/C06 contracts | C03, C05, C06 |
| C08-IMP-003 | Define Progress result contract | C08-IMP-001 |
| C08-IMP-004 | Define availability states | Product Owner decision |
| C08-IMP-005 | Define source reference contract | C03, C05, C06 |
| C08-IMP-006 | Implement source validation interfaces | C08-IMP-005 |
| C08-IMP-007 | Implement Measurement Progress formulas | Formula approval |
| C08-IMP-008 | Implement Action eligibility | Eligibility approval |
| C08-IMP-009 | Implement Action Completion formula | Formula approval |
| C08-IMP-010 | Implement Goal combination | Combination approval |
| C08-IMP-011 | Implement weighting/normalization | Weight approval |
| C08-IMP-012 | Implement Child Goal aggregation | Hierarchy policy |
| C08-IMP-013 | Implement Project Progress | Project policy |
| C08-IMP-014 | Implement boundaries and precision | Precision policy |
| C08-IMP-015 | Define history contract | Snapshot policy |
| C08-IMP-016 | Implement approved recalculation behavior | Recalculation policy |
| C08-IMP-017 | Define C09 read contract | C09 |
| C08-IMP-018 | Write unit and negative tests | C08 core |
| C08-IMP-019 | Write cross-domain integration tests | C03, C05, C06 |
| C08-IMP-020 | Verify no source mutation | All |
| C08-IMP-021 | Document unresolved decisions | All |

## 23. OPEN Decisions

| ID | Decision | Status |
|---|---|---|
| PROGRESS-001 | Numeric Measurement formula | OPEN |
| PROGRESS-002 | Boolean Measurement formula | OPEN |
| PROGRESS-003 | Range target formula | OPEN |
| PROGRESS-004 | Increasing/decreasing target behavior | OPEN |
| PROGRESS-005 | Baseline missing behavior | OPEN |
| PROGRESS-006 | Target missing behavior | OPEN |
| PROGRESS-007 | Supported Measurement types | OPEN — C06 |
| PROGRESS-008 | Action eligibility | OPEN |
| PROGRESS-009 | Cancelled Action handling | OPEN |
| PROGRESS-010 | Archived Action handling | OPEN |
| PROGRESS-011 | Empty Action set behavior | OPEN |
| PROGRESS-012 | Measurement vs Action combination | OPEN |
| PROGRESS-013 | Child Goal contribution | OPEN |
| PROGRESS-014 | Weighting model | OPEN |
| PROGRESS-015 | Weight normalization | OPEN |
| PROGRESS-016 | Missing source handling | OPEN |
| PROGRESS-017 | Goal Progress formula | OPEN |
| PROGRESS-018 | Child Goal aggregation strategy | OPEN |
| PROGRESS-019 | Archived/inactive Child Goal handling | OPEN |
| PROGRESS-020 | Project Progress in MVP | OPEN |
| PROGRESS-021 | Project eligible Goal collection | OPEN |
| PROGRESS-022 | Progress minimum/maximum | OPEN |
| PROGRESS-023 | Above/below boundary behavior | OPEN |
| PROGRESS-024 | Rounding and precision | OPEN |
| PROGRESS-025 | Undefined/insufficient availability enum | OPEN |
| PROGRESS-026 | Progress snapshot persistence | OPEN |
| PROGRESS-027 | Recalculation triggers | OPEN |
| PROGRESS-028 | Historical consistency | OPEN |
| PROGRESS-029 | Rule versioning | OPEN |
| PROGRESS-030 | Goal/Action lifecycle interaction | OPEN |
| PROGRESS-031 | Milestone contribution | OPEN |
| PROGRESS-032 | Schedule contribution | OPEN |
| PROGRESS-033 | Review history requirements | OPEN — C09 |

## 24. Definition of Done

C08 core is complete when:
- Progress result and availability contracts are explicit.
- Source data is validated through owning domain contracts.
- Only approved formulas are implemented.
- Missing and undefined data are never silently converted to zero.
- Goal hierarchy is validated before recursive aggregation.
- Progress does not mutate source domain resources.
- C09 can consume authoritative Progress.
- Calculation history follows the approved persistence policy.
- Unit, negative and integration tests pass.
- Errors follow D03/D06 conventions.
- OPEN decisions are documented.
- No competing Progress calculation exists outside C08.

**Final status:** DETAILED DESIGN — PARTIALLY BLOCKED.
# FLOW-UP — C09 REVIEW RULES
## Domain Implementation Specification

**Module:** C09  
**Domain:** Review Rules  
**Status:** DETAILED DESIGN — PARTIALLY BLOCKED  
**Architecture baseline:** Master Blueprint v0.4  
**Depends on:** C01, C03, C05, C06, C07, C08  
**Integrates with:** C04

---

## 1. Purpose

C09 quản lý Review — hoạt động đánh giá kết quả thực hiện Goal trong một phạm vi và khoảng thời gian xác định.

Review giúp User:
- Xem lại công việc đã lên kế hoạch.
- So sánh Planned với Actual.
- Đánh giá Action completion.
- Xem Measurement results.
- Xem Progress change.
- Ghi nhận kết quả, phát hiện và nhận xét.
- Nhận diện dữ liệu còn thiếu hoặc chưa được ghi nhận.

C09 tổng hợp và đánh giá dữ liệu từ các domain khác nhưng không sở hữu hoặc sửa dữ liệu nguồn.

## 2. Scope

### 2.1. In Scope

- Review identity.
- Review ownership.
- Review scope.
- Review period.
- Review data source contracts.
- Planned vs Actual comparison.
- Review summary.
- Review findings.
- User notes.
- Review lifecycle.
- Missing and partial data handling.
- Review persistence contract.
- Snapshot and historical consistency policy.
- Read contracts for source domains.

### 2.2. Out of Scope

C09 không:
- Sở hữu Goal, Milestone, Action, Measurement, Schedule hoặc Progress.
- Tự tính authoritative Progress.
- Tự thay đổi Action status.
- Tự hoàn thành Goal.
- Tự ghi Measurement records.
- Tự thay đổi Schedule.
- Tự tạo hoặc chỉnh sửa execution records.
- Thay đổi dữ liệu nguồn trong quá trình Review.
- Cho AI tự ghi Review chính thức nếu chưa qua approval/validation.
- Tự quyết định snapshot persistence khi chưa được duyệt.

## 3. Domain Ownership

| Resource / Rule | Owner |
|---|---|
| User ownership | C01 |
| Goal | C03 |
| Milestone | C04 |
| Action and actual execution | C05 |
| Measurement and records | C06 |
| Daily Plan and Schedule | C07 |
| Authoritative Progress | C08 |
| Review and Review Notes | C09 |
| Persistence | D01 |
| Shared contracts | D03 |
| Validation infrastructure | D04 |
| Error mapping | D06 |

C09 sở hữu Review và Review Notes.

C09 có quyền đọc dữ liệu từ domain khác theo ownership boundary.

## 4. Review Concepts

### 4.1. Review Definition

Review là một bản đánh giá kết quả trong một scope và period.

Review có thể chứa:
- Source data references.
- Planned vs Actual comparison.
- Progress information.
- Summary.
- Findings.
- User notes.
- Missing data indicators.

### 4.2. Review Identity

Mỗi Review có stable identity.

Identity không thay đổi khi:
- Summary được chỉnh sửa.
- User thêm note.
- Review được mở lại.
- Review được cập nhật trong phạm vi lifecycle policy.

### 4.3. Review Ownership

Review thuộc một User.

C01 xác minh User identity và access.

Review không lấy ownership từ Goal hoặc Project một cách ngầm định.

### 4.4. Review Result

Review Result là kết quả tổng hợp và đánh giá, không phải Progress calculation mới.

Nếu Review hiển thị Progress, giá trị đó phải lấy từ C08.

## 5. Review Scope Model

Các scope cần xem xét:

| Scope | Description | Status |
|---|---|---|
| Goal-based | Review một Goal | Proposed |
| Period-based | Review trong một khoảng thời gian | Proposed |
| Daily Plan-based | Review một Daily Plan | Proposed |
| Project-based | Review một Project | OPEN |
| Combined scope | Kết hợp nhiều scope | OPEN |

Các scope trên là lựa chọn thiết kế, chưa phải toàn bộ được phê duyệt cho MVP.

### 5.1. Goal-based Review

Review có thể tập trung vào một Goal.

C03 xác minh Goal tồn tại và User có quyền truy cập.

### 5.2. Period-based Review

Review có thể xác định theo khoảng thời gian, không nhất thiết chỉ gắn với một Goal.

Cần xác định cách lấy Action, Measurement và Planning data trong phạm vi đó.

### 5.3. Daily Plan-based Review

Review có thể đánh giá một Daily Plan cụ thể.

C07 sở hữu Daily Plan và Schedule.

C09 chỉ đọc dữ liệu để tổng hợp.

### 5.4. Project-based Review

Project Review là OPEN.

C02 sở hữu Project; C03 sở hữu Goal; C09 chỉ tổng hợp các dữ liệu phù hợp.

### 5.5. Scope Consistency

Mỗi Review phải có scope hợp lệ và nhất quán.

Không tạo một Review không có scope rõ ràng.

Việc cho phép nhiều scope trong cùng một Review cần quyết định riêng.

## 6. Review Period

Logical period:

| Field | Meaning | Status |
|---|---|---|
| period_start | Period start | Required concept |
| period_end | Period end | Required concept |
| timezone | Timezone context | OPEN |
| period_type | Daily/Weekly/Monthly/Custom | OPEN |

### 6.1. Period Validation

- Period start phải hợp lệ.
- Period end phải hợp lệ.
- End không được trước start.
- Boundary semantics phải nhất quán.
- Timezone phải phù hợp với date/time semantics của nguồn dữ liệu.

### 6.2. Period Types

Các loại cần hỗ trợ:
- Daily.
- Weekly.
- Monthly.
- Custom.

Không tự chọn ngày bắt đầu tuần hoặc cách xác định tháng nếu chưa có policy.

### 6.3. Period Overlap

OPEN:
- Có cho phép nhiều Review cùng scope và period không?
- Có cho phép period overlap không?
- Có giới hạn một Review mỗi ngày/tuần không?
- Review có được tạo lại cho cùng một period không?

Không tự đặt unique constraint.

## 7. Review Data Sources

C09 tổng hợp dữ liệu qua các contract của module sở hữu.

| Source | Owner | Data consumed |
|---|---|---|
| User access | C01 | Ownership and authorization |
| Goal | C03 | Goal identity, title, scope, target date, lifecycle |
| Milestone | C04 | Milestone facts and lifecycle |
| Action | C05 | Action status and execution data |
| Measurement | C06 | Definitions, values and history |
| Planning | C07 | Daily Plan and Schedule |
| Progress | C08 | Authoritative Progress and history |

### 7.1. Source Integrity

Mỗi source phải:
- Thuộc đúng User/scope.
- Có timestamp semantics rõ ràng.
- Có thể xác định được period relevance.
- Không bị giả định là đầy đủ nếu thiếu record.
- Không bị C09 thay đổi.

### 7.2. Source Availability

C09 phải phân biệt:
- Source available.
- Source partially available.
- Source missing.
- Source not applicable.
- Source invalid.

Không coi nguồn không có dữ liệu là một kết quả zero.

## 8. Planned vs Actual Comparison

### 8.1. Action Comparison

C09 có thể so sánh:
- Planned Actions.
- Completed Actions.
- Incomplete Actions.
- Cancelled Actions nếu policy yêu cầu.
- Actions có Schedule nhưng không có execution data.
- Actions có execution data nhưng không có Schedule.

### 8.2. Unrecorded vs Incomplete

Phải phân biệt:
- Action chưa hoàn thành.
- Action đã thực hiện nhưng không có execution record.
- Action chưa có Schedule.
- Schedule đã qua nhưng chưa có execution record.
- Action có execution record nhưng chưa completed.

Không suy luận rằng thiếu execution record có nghĩa Action chắc chắn chưa được thực hiện.

### 8.3. Planned Time vs Actual Time

C07 cung cấp:
- Planned start.
- Planned end.
- Planned duration.

C05 cung cấp:
- Actual start.
- Actual completion.
- Actual duration nếu được hỗ trợ.

C09 chỉ so sánh hai tập dữ liệu.

Không tự lấy Schedule time làm actual time.

### 8.4. Measurement Comparison

C09 có thể so sánh:
- Baseline.
- Target.
- Recorded values.
- Current value.
- Historical values.

C06 sở hữu Measurement definitions và records.

C09 không tự thay đổi unit hoặc tính lại Measurement value.

### 8.5. Progress Change

C09 có thể hiển thị:
- Progress hiện tại.
- Progress lịch sử.
- Progress change trong period nếu C08 cung cấp dữ liệu phù hợp.

C08 là authoritative source.

C09 không tự tính lại Goal Progress từ Action/Measurement.

### 8.6. Variance

Variance có thể biểu diễn chênh lệch giữa:
- Planned và Actual time.
- Target và Measurement value.
- Expected và observed execution.

Cách tính variance và semantics từng loại vẫn OPEN.

Không dùng một phép trừ chung cho mọi loại dữ liệu.

## 9. Review Summary

### 9.1. Summary Concepts

Review Summary có thể chứa:
- Scope and period.
- Completed work.
- Incomplete work.
- Measurement results.
- Progress results.
- Planned vs Actual comparison.
- Variance.
- Missing data.
- Findings.
- User observations.

### 9.2. Summary Ownership

C09 sở hữu cấu trúc Review Summary.

Các giá trị nguồn phải được lấy từ domain sở hữu tương ứng.

### 9.3. Summary Generation

Summary có thể được tạo:
- Từ dữ liệu nguồn theo rules cố định.
- Từ dữ liệu tổng hợp đã được xác minh.
- Có thể có AI hỗ trợ ở application/AI layer nếu được duyệt.

Dù được tạo theo cách nào, summary không được:
- Tự thay đổi source data.
- Tự tạo Progress formula.
- Bịa ra dữ liệu không tồn tại.
- Biến missing data thành zero.
- Khẳng định Action đã hoàn thành khi không có nguồn xác nhận.

### 9.4. Findings

Findings là các nhận xét hoặc phát hiện của Review.

Cần phân biệt:
- Data-derived findings.
- User-entered observations.
- AI-generated suggestions nếu có.

Source và provenance phải được giữ rõ nếu loại finding đó được hỗ trợ.

## 10. Review Notes

### 10.1. Note Model

Logical model:

| Field | Meaning | Status |
|---|---|---|
| id | Note identity | Required concept |
| review_id | Owning Review | Required |
| content | Note content | Required |
| created_at | Creation timestamp | Required |
| updated_at | Last update timestamp | Required |
| deleted_at | Deletion timestamp | OPEN |

### 10.2. Note Ownership

Note thuộc một Review.

Review thuộc User.

Không tạo Note ownership độc lập với Review.

### 10.3. Note Operations

- Create note.
- Update note.
- Retrieve notes.
- Delete note theo policy.

### 10.4. Note Lifecycle

OPEN:
- Có hỗ trợ delete không?
- Có lưu edit history không?
- Có thể xóa note sau khi Review completed không?
- Note có bị archive theo Review không?

Không tự thêm rich-text hoặc attachment support vào core nếu chưa có yêu cầu.

## 11. Review Lifecycle

### 11.1. Lifecycle Concepts

- Create.
- Draft.
- Complete.
- Update.
- Reopen.
- Archive.
- Restore.
- Delete.

### 11.2. Proposed Status Model

Có thể xem xét:
- `DRAFT`
- `COMPLETED`
- `ARCHIVED`

Đây là đề xuất, chưa phải enum chính thức.

### 11.3. Lifecycle Rules

Review lifecycle không được làm thay đổi dữ liệu nguồn.

Review completed không đồng nghĩa Goal completed.

Review archived không đồng nghĩa Goal/Action/Measurement archived.

### 11.4. Reopening

OPEN:
- Có được reopen Review completed không?
- Reopen có giữ summary cũ không?
- Reopen có refresh source data không?
- Notes và findings có được sửa không?
- Có cần giữ previous Review version không?

Không tự chọn một behavior.

## 12. Review Persistence Model

### 12.1. On-demand Review

On-demand Review là kết quả được tạo khi User yêu cầu xem lại dữ liệu.

Có thể không persist toàn bộ kết quả nếu policy chưa yêu cầu.

### 12.2. Persisted Review

Persisted Review là Review được lưu để User xem lại trong tương lai.

### 12.3. Snapshot

Snapshot có thể lưu:
- Scope.
- Period.
- Source references.
- Progress result.
- Comparison result.
- Summary.
- Calculation timestamps.
- Snapshot creation time.

Việc lưu snapshot đầy đủ hay chỉ lưu references vẫn OPEN.

### 12.4. Dynamic Refresh

OPEN:
- Review mở lại có đọc source data mới nhất không?
- Review completed có giữ nguyên dữ liệu cũ không?
- Có hỗ trợ refresh một Review đã lưu không?
- Refresh có tạo version mới không?

### 12.5. Historical Consistency

Nếu source data thay đổi sau Review:
- Không được âm thầm thay đổi historical Review nếu snapshot policy yêu cầu bất biến.
- Nếu Review là dynamic, phải thể hiện rõ thời điểm và nguồn dữ liệu được đọc.
- Không trộn snapshot cũ với source mới mà không có metadata.

### 12.6. Multiple Reviews

Có thể tồn tại nhiều Review cho cùng scope/period nếu policy cho phép.

Không tự áp đặt uniqueness.

## 13. Missing and Partial Data

### 13.1. Missing Data Categories

| Condition | Meaning |
|---|---|
| No Schedule | No planned time data found |
| No Execution Record | Actual execution data not recorded |
| Incomplete Action | Action state indicates not completed |
| No Measurement Record | No measurement value recorded |
| No Progress Result | C08 cannot provide a result |
| Partial Source | Some expected data is unavailable |
| Invalid Source | Source data fails validation |

### 13.2. Required Distinctions

C09 phải phân biệt:
- Unrecorded.
- Incomplete.
- Not applicable.
- Insufficient data.
- Invalid source.

Không biến chúng thành cùng một trạng thái.

### 13.3. Review Completeness

Review có thể cần completeness indicator.

OPEN:
- Completeness được tính theo số nguồn có dữ liệu?
- Có cần từng source status?
- Có bắt buộc tất cả source phải có dữ liệu để Review completed?
- Review có thể completed với partial data không?

Không tự coi Review incomplete chỉ vì một source không áp dụng.

## 14. Domain Invariants

| ID | Invariant |
|---|---|
| C09-INV-001 | Every Review has one valid User owner |
| C09-INV-002 | Review scope must be valid |
| C09-INV-003 | Review period must be valid |
| C09-INV-004 | Source data must respect ownership boundaries |
| C09-INV-005 | C09 reads source data through owning domain contracts |
| C09-INV-006 | Missing data is not silently interpreted as zero |
| C09-INV-007 | Unrecorded execution is distinct from incomplete execution |
| C09-INV-008 | Planned time is distinct from actual time |
| C09-INV-009 | Progress shown in Review comes from C08 |
| C09-INV-010 | Review does not independently calculate authoritative Progress |
| C09-INV-011 | Review does not mutate source business data |
| C09-INV-012 | Review Notes belong to a valid Review |
| C09-INV-013 | Review lifecycle does not change Goal/Action lifecycle |
| C09-INV-014 | Historical Review behavior follows approved persistence policy |
| C09-INV-015 | Snapshot metadata identifies the source time/version where required |
| C09-INV-016 | Review summary does not fabricate unavailable source facts |

## 15. Operations and Contracts

Logical operations:

### 15.1. Review

- `createReview`
- `updateReview`
- `getReview`
- `getReviewsByScope`
- `getReviewsByPeriod`
- `validateReviewScope`
- `validateReviewPeriod`
- `validateReviewOwnership`

### 15.2. Data Aggregation

- `collectReviewSources`
- `getPlannedActionData`
- `getActualExecutionData`
- `getMeasurementData`
- `getProgressData`
- `validateReviewSourceOwnership`
- `resolveReviewDataAvailability`

### 15.3. Comparison and Summary

- `buildPlannedActualComparison`
- `buildMeasurementComparison`
- `buildProgressSummary`
- `buildReviewSummary`
- `validateReviewSummary`

These operations aggregate and present source data. They must not duplicate C08 Progress formulas.

### 15.4. Notes

- `createReviewNote`
- `updateReviewNote`
- `getReviewNotes`
- `deleteReviewNote` — subject to deletion policy.

### 15.5. Lifecycle

- `completeReview`
- `reopenReview` — subject to approval.
- `archiveReview` — subject to approval.
- `restoreReview` — subject to approval.
- `deleteReview` — subject to deletion policy.

### 15.6. Snapshot

- `createReviewSnapshot` — subject to snapshot policy.
- `getReviewSnapshot`
- `refreshReviewData` — subject to dynamic refresh policy.

### 15.7. Contract Requirements

Every operation must:
1. Validate User ownership.
2. Validate Review scope and period.
3. Read source data through its owning domain.
4. Validate source ownership and availability.
5. Preserve missing/partial data semantics.
6. Avoid source domain mutation.
7. Use C08 for authoritative Progress.
8. Return a structured Review result or domain error.

## 16. Validation Catalog

| Error code | Meaning |
|---|---|
| REVIEW_NOT_FOUND | Review does not exist |
| REVIEW_ACCESS_DENIED | User cannot access Review |
| REVIEW_INVALID_ID | Invalid Review identifier |
| REVIEW_OWNER_REQUIRED | Owner reference required |
| REVIEW_OWNERSHIP_INVALID | Ownership validation failed |
| REVIEW_SCOPE_REQUIRED | Review scope required |
| REVIEW_SCOPE_INVALID | Invalid scope |
| REVIEW_SCOPE_NOT_FOUND | Referenced scope does not exist |
| REVIEW_SCOPE_ACCESS_DENIED | User cannot access referenced scope |
| REVIEW_PERIOD_REQUIRED | Period required |
| REVIEW_PERIOD_INVALID | Invalid period |
| REVIEW_PERIOD_RANGE_INVALID | End is before start |
| REVIEW_PERIOD_OVERLAP | Period overlap under approved policy |
| REVIEW_SOURCE_INVALID | Source data invalid |
| REVIEW_SOURCE_ACCESS_DENIED | Source data inaccessible |
| REVIEW_SOURCE_INCOMPLETE | Required source data incomplete |
| REVIEW_SOURCE_UNAVAILABLE | Source data unavailable |
| REVIEW_SOURCE_OWNERSHIP_INVALID | Source ownership mismatch |
| REVIEW_PROGRESS_SOURCE_INVALID | C08 Progress result invalid |
| REVIEW_COMPARISON_INVALID | Invalid comparison input |
| REVIEW_SUMMARY_INVALID | Invalid summary |
| REVIEW_NOTE_NOT_FOUND | Note does not exist |
| REVIEW_NOTE_INVALID | Invalid note |
| REVIEW_NOTE_ACCESS_DENIED | User cannot access note |
| REVIEW_STATUS_INVALID | Invalid Review status |
| REVIEW_STATUS_TRANSITION_INVALID | Invalid lifecycle transition |
| REVIEW_REOPEN_BLOCKED | Reopening not permitted |
| REVIEW_ARCHIVE_BLOCKED | Archival not permitted |
| REVIEW_RESTORE_BLOCKED | Restoration not permitted |
| REVIEW_DELETE_BLOCKED | Deletion not permitted |
| REVIEW_SNAPSHOT_INVALID | Invalid snapshot |
| REVIEW_SNAPSHOT_CONFLICT | Snapshot conflicts with current state |
| REVIEW_REFRESH_BLOCKED | Refresh not permitted |
| REVIEW_DEPENDENCY_CONFLICT | Related domain dependency blocks operation |
| REVIEW_VALIDATION_FAILED | General validation failure |

Error identifiers must follow D06 conventions.

## 17. Cross-Domain Integration

| Module | Interaction |
|---|---|
| C01 | Validate User ownership/access |
| C03 | Read Goal identity, hierarchy, scope and lifecycle |
| C04 | Read Milestone facts |
| C05 | Read Action status and actual execution |
| C06 | Read Measurement definitions and records |
| C07 | Read Daily Plan and Schedule |
| C08 | Read authoritative Progress and history |
| D01 | Persist Review and snapshots |
| D03 | Shared Review contracts |
| D04 | Validation infrastructure |
| D06 | Error mapping |

C09 must not depend on UI, HTTP transport, database drivers or AI provider implementations.

## 18. Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| C09-AC-001 | Review has stable identity |
| C09-AC-002 | Review belongs to one valid User |
| C09-AC-003 | Review scope is validated |
| C09-AC-004 | Review period is validated |
| C09-AC-005 | Source data is read through owning domain contracts |
| C09-AC-006 | Source ownership is validated |
| C09-AC-007 | Planned Actions are distinct from Actual execution |
| C09-AC-008 | Unrecorded execution is distinct from incomplete Action |
| C09-AC-009 | Planned time is distinct from actual time |
| C09-AC-010 | Measurement data is read through C06 |
| C09-AC-011 | Progress is read from C08 |
| C09-AC-012 | C09 does not calculate authoritative Progress |
| C09-AC-013 | Missing data is not interpreted as zero |
| C09-AC-014 | Partial source availability is represented explicitly |
| C09-AC-015 | Review summary does not fabricate source facts |
| C09-AC-016 | Review Notes belong to the correct Review |
| C09-AC-017 | Review lifecycle does not mutate source resources |
| C09-AC-018 | Snapshot behavior follows approved persistence policy |
| C09-AC-019 | Source changes do not silently alter immutable historical Review |
| C09-AC-020 | Multiple Review behavior follows approved policy |
| C09-AC-021 | Review can be retrieved by approved scope/period queries |
| C09-AC-022 | Domain errors follow D06 conventions |

## 19. Testing Requirements

### Unit Tests
- Review ownership.
- Scope validation.
- Period validation.
- Source availability.
- Source ownership.
- Planned vs Actual comparison.
- Measurement comparison.
- Progress read contract.
- Summary validation.
- Note ownership.
- Lifecycle validation.

### Integration Tests
- C01 + C09: User ownership.
- C03 + C09: Goal scope.
- C04 + C09: Milestone facts.
- C05 + C09: Action and execution data.
- C06 + C09: Measurement history.
- C07 + C09: Planning/Schedule comparison.
- C08 + C09: authoritative Progress.
- D01 + C09: snapshot persistence if approved.

### Negative Tests
- Inaccessible scope.
- Invalid period.
- Invalid source ownership.
- Missing source.
- Partial source.
- Invalid Progress source.
- Invalid lifecycle transition.
- Note associated with another Review.
- Unauthorized snapshot refresh.
- Unapproved deletion.

### Invariant Tests
- Review never mutates source data.
- Review never calculates authoritative Progress.
- Missing source data never becomes zero.
- Planned and Actual remain distinct.
- Historical Review follows the approved snapshot/dynamic policy.

## 20. Implementation Boundaries

### Ready for Core Implementation
- Review logical model.
- User ownership validation.
- Review scope contract.
- Period validation.
- Source data interfaces.
- Source ownership validation.
- Planned vs Actual comparison contract.
- Missing/partial data representation.
- Review Notes logical contract.
- Domain error structure.
- C08 authoritative Progress integration.

### Partially Blocked
- Supported Review scope combinations.
- Project Review.
- Period types and timezone boundaries.
- Period overlap and uniqueness.
- Exact comparison formulas.
- Summary persistence.
- AI-generated summary behavior.
- Note edit/delete history.
- Review lifecycle and status transitions.
- On-demand vs persisted Review.
- Snapshot vs dynamic refresh.
- Multiple Reviews for the same scope/period.
- Review completeness criteria.
- Source retention and historical consistency.

Do not implement snapshot or lifecycle behavior by assumption.

## 21. Implementation Task Breakdown

| Task ID | Task | Dependency |
|---|---|---|
| C09-IMP-001 | Inspect repository and domain conventions | None |
| C09-IMP-002 | Inspect C01/C03–C08 contracts | All source modules |
| C09-IMP-003 | Define Review logical model | C09-IMP-001 |
| C09-IMP-004 | Define Review scope contract | Scope decision |
| C09-IMP-005 | Define Review period contract | Period decision |
| C09-IMP-006 | Define Review Note model | C09-IMP-003 |
| C09-IMP-007 | Define domain errors | D06 |
| C09-IMP-008 | Implement User ownership validation | C01 |
| C09-IMP-009 | Implement scope validation | C03/C02 |
| C09-IMP-010 | Implement period validation | C09-IMP-005 |
| C09-IMP-011 | Define source data contracts | C03–C08 |
| C09-IMP-012 | Implement source availability validation | C09-IMP-011 |
| C09-IMP-013 | Implement Planned vs Actual comparison | C05/C07 |
| C09-IMP-014 | Implement Measurement comparison | C06 |
| C09-IMP-015 | Implement authoritative Progress retrieval | C08 |
| C09-IMP-016 | Implement Review summary contract | C09 |
| C09-IMP-017 | Implement Review Note operations | C09-IMP-006 |
| C09-IMP-018 | Define lifecycle contract | Lifecycle approval |
| C09-IMP-019 | Define snapshot/dynamic persistence contract | Persistence decision |
| C09-IMP-020 | Write unit and negative tests | C09 core |
| C09-IMP-021 | Write cross-domain integration tests | C01–C08 |
| C09-IMP-022 | Verify no source mutation or Progress duplication | All |
| C09-IMP-023 | Document unresolved decisions | All |

## 22. OPEN Decisions

| ID | Decision | Status |
|---|---|---|
| REVIEW-001 | Goal-based Review support in MVP | OPEN |
| REVIEW-002 | Period-based Review support in MVP | OPEN |
| REVIEW-003 | Daily Plan-based Review support in MVP | OPEN |
| REVIEW-004 | Project-based Review support in MVP | OPEN |
| REVIEW-005 | Combined Review scope | OPEN |
| REVIEW-006 | Review period timezone | OPEN |
| REVIEW-007 | Week start convention | OPEN |
| REVIEW-008 | Month boundary convention | OPEN |
| REVIEW-009 | Period overlap policy | OPEN |
| REVIEW-010 | Multiple Reviews per scope/period | OPEN |
| REVIEW-011 | Planned vs Actual comparison formulas | OPEN |
| REVIEW-012 | Unrecorded execution classification | OPEN |
| REVIEW-013 | Variance calculation rules | OPEN |
| REVIEW-014 | Review completeness rules | OPEN |
| REVIEW-015 | Review summary persistence | OPEN |
| REVIEW-016 | AI-generated summary support | OPEN |
| REVIEW-017 | Review Note edit/delete history | OPEN |
| REVIEW-018 | Review lifecycle status enum | OPEN |
| REVIEW-019 | Reopening completed Review | OPEN |
| REVIEW-020 | Archive/restore/delete behavior | OPEN |
| REVIEW-021 | On-demand vs persisted Review | OPEN |
| REVIEW-022 | Snapshot vs dynamic refresh | OPEN |
| REVIEW-023 | Snapshot source reference strategy | OPEN |
| REVIEW-024 | Historical consistency after source changes | OPEN |
| REVIEW-025 | Refresh completed Review behavior | OPEN |
| REVIEW-026 | Review source retention | OPEN |
| REVIEW-027 | Partial data and completion eligibility | OPEN |
| REVIEW-028 | Project Review and Project Progress dependencies | OPEN — C08 |

## 23. Definition of Done

C09 core is complete when:
- Review identity, ownership, scope and period contracts are defined.
- Source data is retrieved through owning domain contracts.
- Planned vs Actual distinction is preserved.
- Missing and partial data are explicit.
- Progress is consumed from C08 only.
- Review Notes belong to the correct Review.
- Review never mutates source domain data.
- Snapshot/dynamic behavior follows approved policy.
- Unit, negative and integration tests pass.
- Errors follow D03/D06 conventions.
- OPEN decisions are documented.
- No code outside C09 ownership is silently modified.

**Final status:** DETAILED DESIGN — PARTIALLY BLOCKED.
# 11. CROSS-DOMAIN DESIGN

Before individual Domain Specifications are finalized, the following shared design areas must be reviewed.

## 11.1. Entity Ownership Matrix

Identify the authoritative owner of each business entity.

## 11.2. Entity Relationship Matrix

Document all entity relationships across C01–C09.

## 11.3. Cardinality Matrix

Document relationship cardinality:
- One-to-one.
- One-to-many.
- Many-to-many.
- Optional relationships.
- Required relationships.

All cardinalities must be explicitly approved before implementation.

## 11.4. Lifecycle Matrix

Document:
- Status definitions.
- Allowed transitions.
- Forbidden transitions.
- Reopening behavior.
- Archive behavior.
- Delete behavior.
- Effects on related entities.

## 11.5. Ownership and Scope Matrix

Document how ownership and scope propagate through related resources.

## 11.6. Invariant Catalog

Create a centralized catalog of business invariants and identify their owning Domains.

## 11.7. Validation Catalog

Document:
- Validation rule.
- Owning Domain.
- Triggering operation.
- Required input.
- Failure condition.
- Expected error classification.

## 11.8. Cross-Domain Operation Rules

Identify operations that affect multiple Domains, including:
- Goal movement.
- Goal archival.
- Goal deletion.
- Action reassignment.
- Project deletion.
- AI proposal application.
- Progress recalculation.
- Review snapshot creation.

## 11.9. Historical Data and Consistency

Document how related data behaves when source entities are:
- Updated.
- Archived.
- Restored.
- Deleted.
- Moved.
- Recalculated.

---

# 12. DOMAIN SPECIFICATION STANDARD

Every C01–C09 Domain must eventually be developed using a consistent specification structure.

Each Domain Specification must contain:

1. Purpose
2. Business Scope
3. Responsibilities
4. Non-Responsibilities
5. Business Concepts
6. Domain Entities
7. Entity Attributes
8. Entity Relationships
9. Cardinality Rules
10. Ownership and Scope Rules
11. Business Rules
12. Domain Invariants
13. Lifecycle and Status Transitions
14. Validation Rules
15. Operations and Domain Behaviors
16. Cross-Domain Dependencies
17. Cross-Domain Effects
18. Error Conditions
19. Data Consistency and Historical Behavior
20. Acceptance Criteria
21. Testing Requirements
22. Decisions and Open Questions
23. Implementation Readiness

The exact number of sections may be adjusted when a Domain requires additional specialized content, but the common structure must remain consistent.

---

# 13. DOMAIN IMPLEMENTATION READINESS

A Domain is not considered implementation-ready merely because its concepts have been documented.

A Domain can be marked `READY FOR IMPLEMENTATION` only when:

- Its business scope is clear.
- Its entities are defined.
- Its relationships are explicit.
- Its cardinalities are approved.
- Its ownership rules are approved.
- Its invariants are defined.
- Its lifecycle is defined.
- Its validation rules are defined.
- Its cross-domain dependencies are resolved.
- Its acceptance criteria are testable.
- No unresolved decision blocks its core implementation.

Non-critical future features may remain OPEN if they do not affect the approved MVP behavior.

Recommended status values:

- `NOT STARTED`
- `OVERVIEW DRAFT`
- `BREAKDOWN COMPLETE`
- `DETAILED DESIGN`
- `PARTIALLY BLOCKED`
- `READY FOR IMPLEMENTATION`
- `IMPLEMENTED`
- `VERIFIED`

---

# 14. DOMAIN DEVELOPMENT ORDER

Recommended development sequence:

| Order | Domain | Primary Dependency |
|---|---|---|
| 1 | C01 — Identity & Ownership | B01 |
| 2 | C02 — Workspace & Project | C01, B02 |
| 3 | C03 — Goal & Hierarchy | C01, C02, B03 |
| 4 | C04 — Milestone | C03, B04 |
| 5 | C05 — Action | C03, C04, B05 |
| 6 | C06 — Measurement | C03, B06 |
| 7 | C07 — Planning & Schedule | C01, C05, B07 |
| 8 | C08 — Progress | C03, C05, C06, B08 |
| 9 | C09 — Review | C03–C08, B09 |

This is a recommended dependency-aware order, not a requirement to complete every Domain sequentially. Independent work may proceed in parallel after shared dependencies are clarified.

---

# 15. RELATIONSHIP WITH OTHER SYSTEM LAYERS

## B — Functional Modules

B01–B10 implement application capabilities using the business rules defined by C01–C09.

## D — Data & Infrastructure

D01–D08 provide persistence, contracts, validation infrastructure, communication, error handling, observability and security mechanisms.

The Domain Layer defines business meaning; D provides technical mechanisms to enforce and support it.

## A — Presentation

The Presentation Layer provides user-facing interactions.

UI components must consume application outputs and must not independently redefine Domain rules or authoritative calculations.

## E — AI Capability

AI-generated content is proposal data until validated and explicitly approved through the normal application and Domain rules.

AI capabilities must not bypass Domain invariants.

---

# 16. FINAL EXPECTED RESULT

The completed Domain Layer must provide:

1. A complete business model for FLOW-UP.
2. Explicit entity ownership.
3. Explicit entity relationships and cardinalities.
4. Defined business invariants.
5. Defined lifecycle and status transitions.
6. Consistent validation rules.
7. Clear cross-domain operation behavior.
8. Testable business acceptance criteria.
9. A reliable foundation for D01–D08.
10. A stable business foundation for implementing B01–B10.

**Core principle:**

The purpose of C01–C09 is not to create more documentation. It is to eliminate business ambiguity so that developers can implement FLOW-UP consistently, test it reliably, and integrate modules without inventing missing rules during coding.

The Domain layer owns business meaning and invariants. Exact entity attributes, relationship cardinality, status transitions, and validation rules are not yet fully designed.

## D. DATA & INFRASTRUCTURE

```text
DATA & INFRASTRUCTURE
│
├── D01. Database & Persistence
├── D02. Authentication Integration
├── D03. Shared Types & Contracts
├── D04. Validation
├── D05. API / Application Communication
├── D06. Error Handling
├── D07. Logging & Observability
└── D08. Security & Configuration
```

### D01. Database & Persistence

#### 1. Purpose

D01 is responsible for providing the persistent data layer for FLOW-UP.

It defines how application data is structured, stored, related, validated, and maintained over time.

D01 provides a consistent persistence foundation for other modules. Business modules must access persistent data through the application's defined data-access layer rather than implementing their own database logic independently.

#### 2. Responsibilities

D01 owns the following responsibilities:

- Persistent storage for application data.
- Database schema design and maintenance.
- Database migrations and schema versioning.
- Primary keys, foreign keys, and relational constraints.
- Indexes and query performance foundations.
- Development seed data.
- Transaction and data consistency support.
- Backup and recovery considerations.
- Database-level integrity and persistence rules.

#### 3. Scope

**Included:**

- Defining database tables and relationships.
- Defining column types, nullability, defaults, and constraints.
- Maintaining schema changes through migrations.
- Ensuring relational integrity.
- Defining indexes for expected query patterns.
- Providing development and testing seed data.
- Establishing database access conventions.
- Documenting backup and recovery requirements.

**Excluded:**

- Authentication and identity-provider integration.
- Business workflows and application use cases.
- User-interface state management.
- API endpoint implementation.
- Business authorization decisions.
- Background job orchestration.
- Analytics and reporting logic.

These responsibilities belong to their respective modules.

#### 4. Data Ownership and Boundaries

D01 owns the database structure and persistence mechanisms.

Individual business modules own the meaning and business rules of their data.

Examples:

- B01 owns authentication and user-context behavior.
- B02 owns workspace and project-management behavior.
- D01 defines how the corresponding records are stored and related.

Database ownership does not mean D01 owns every business rule.

Other modules must not bypass defined data-access boundaries to execute arbitrary database operations.

#### 5. Database Structure

The database schema must follow these general principles:

**5.1 Primary Keys**

- Every persistent entity must have a primary key.
- Primary keys must uniquely identify records.
- Primary-key generation must follow one consistent project-wide convention.
- Other modules must not assume that an internal identifier is identical to an external provider identifier.

**5.2 Relationships**

- Relationships between entities must be explicitly defined.
- Foreign keys must be used where relational integrity is required.
- Relationship cardinality must be documented.
- Deletion behavior must be explicitly defined where dependent records exist.

**5.3 Constraints**

Use database constraints to protect data integrity where appropriate:

- NOT NULL for required values.
- UNIQUE for values that must not be duplicated.
- FOREIGN KEY for relational integrity.
- CHECK for suitable database-level validation.
- DEFAULT for appropriate default values.

Application-level validation and database constraints serve different purposes. Neither should be treated as a complete replacement for the other.

**5.4 Naming Conventions**

- Table names must follow one consistent naming convention.
- Column names must be descriptive and consistent.
- Primary-key and foreign-key naming must be predictable.
- Migration files must follow a consistent naming and ordering convention.

The final naming convention must be documented before implementation begins.

#### 6. Schema and Migrations

All structural database changes must be managed through migrations.

Requirements:

- Each migration must represent a specific schema change.
- Migrations must be versioned and executed in a predictable order.
- Existing migration files must not be silently modified after they have been applied to shared environments.
- Schema changes must be reviewed for compatibility with existing application code.
- Migration failures must not leave the database in an undocumented or inconsistent state.
- The application must be able to determine which migrations have already been applied.

Development, testing, and production environments must use the same migration history.

Manual database changes must not become the normal method of maintaining the schema.

#### 7. Data Access and Persistence Rules

Other modules must use the established database access layer.

Requirements:

- Database connection and configuration must be centralized.
- Database access logic must not be duplicated across unrelated modules.
- Queries must use parameterized operations or the equivalent safe mechanism provided by the selected database library.
- Transactions must be used when multiple related operations must succeed or fail together.
- Database errors must be handled at the appropriate application boundary.
- Sensitive information must not be exposed through database error messages or logs.
- Persistent data must not depend on temporary application memory.

The exact repository, service, ORM, or query-builder structure will be defined during implementation.

#### 8. Indexing and Performance

Indexes must support actual application query patterns.

Requirements:

- Primary keys must have appropriate indexing.
- Foreign-key columns should be evaluated for indexing.
- Frequently queried columns should be evaluated for indexing.
- Composite indexes may be introduced when queries commonly filter or sort by multiple columns.
- Unnecessary indexes should be avoided because they increase storage and write costs.
- Index changes must be managed through migrations.

Performance optimization must be based on observed or expected query patterns, not arbitrary index creation.

#### 9. Development Seed Data

D01 must provide a predictable way to initialize development and testing data.

Requirements:

- Seed data must support local development and automated testing.
- Seed operations should be repeatable without creating uncontrolled duplicate records.
- Development seed data must be clearly separated from production data.
- Real user credentials and sensitive production data must not be included.
- The application must not depend on development seed data to operate in production.

Seed data should cover the main entities and relationships required to test the application.

#### 10. Data Integrity and Consistency

The persistence layer must protect data consistency.

Requirements:

- Invalid relationships must be rejected by the database where applicable.
- Operations involving multiple dependent records must use transactions when necessary.
- Unique business identifiers must have appropriate uniqueness protection.
- Deletion and update behavior must be explicitly considered for related records.
- Application logic must not assume that a database operation succeeded before receiving confirmation.

The database is the final persistence authority for stored records.

#### 11. Backup and Recovery

D01 must define the application's backup and recovery considerations.

The design must consider:

- What data needs to be backed up.
- Backup frequency.
- Backup retention.
- Backup storage location.
- Recovery procedure.
- Data-loss tolerance.
- Recovery-time expectations.

Actual backup scheduling and infrastructure configuration may depend on the selected database provider and deployment environment.

Backup availability must not be assumed merely because the database provider offers backup features. The recovery process must be documented and testable.

#### 12. Security Requirements

- Database credentials must not be committed to source control.
- Connection secrets must be provided through environment configuration or an approved secret-management mechanism.
- Production database access must be restricted.
- Database operations must use safe query mechanisms.
- Sensitive data must not be logged unnecessarily.
- Development and production database environments must remain separated.
- Access to persistent data must follow the application's authorization boundaries.

#### 13. Dependencies and Interfaces

D01 provides persistence capabilities to the application modules.

Dependencies include:

- B01: User identity and user-related persistence.
- B02: Workspace and project-related persistence.
- Other business modules: Their corresponding persistent entities.

D01 must not depend on business modules to define its fundamental database infrastructure.

The database schema must support the approved domain model and must not independently introduce unapproved business features.

#### 14. Acceptance Criteria

D01 is considered ready when:

- [ ] The database technology and connection strategy are documented and approved.
- [ ] The initial database schema is defined.
- [ ] Primary keys and relationships are documented.
- [ ] Required constraints are defined.
- [ ] Migration execution works from an empty database.
- [ ] Existing migrations can be applied in the correct order.
- [ ] Development seed data can be initialized repeatably.
- [ ] Database access follows a consistent application-level convention.
- [ ] Related operations can use transactions where required.
- [ ] Database errors are handled without exposing sensitive information.
- [ ] Backup and recovery considerations are documented.
- [ ] Other modules can use the persistence layer without implementing separate database infrastructure.

#### 15. Testing Requirements

D01 must support the following tests:

**Schema Tests**
- Verify required tables and columns exist.
- Verify primary keys and foreign keys.
- Verify required constraints.
- Verify unique constraints.

**Migration Tests**
- Apply all migrations to an empty database.
- Verify migrations execute in the correct order.
- Verify the resulting schema matches the expected structure.

**Persistence Tests**
- Create and retrieve records.
- Update existing records.
- Delete records according to defined deletion rules.
- Verify relational integrity.
- Verify transaction rollback when an operation fails.

**Seed Tests**
- Initialize development seed data.
- Run seed initialization repeatedly.
- Verify that duplicate or inconsistent data is not introduced.

#### 16. Decisions and Open Questions

The following decisions must be resolved before the corresponding implementation work is finalized:

- Database technology and provider.
- Database access approach: ORM, query builder, or direct SQL.
- Primary-key format.
- Table and column naming conventions.
- Timestamp conventions and timezone handling.
- Soft delete versus hard delete policy.
- Migration tooling.
- Backup and recovery strategy.
- Production database deployment configuration.

No technology or implementation choice in this section is considered approved unless it is explicitly recorded in the Decision Log.

#### 17. Architecture Status

D01 defines the responsibilities and boundaries of the persistence layer.

The detailed database schema, technology selection, migration tooling, and deployment configuration remain subject to the project's approved architecture decisions.

D01 must provide a stable persistence foundation without taking ownership of business logic belonging to other modules.

### D02. Authentication Integration

Initial responsibilities:
- Integrate the selected provider.
- Validate authenticated identity for protected operations.
- Keep provider credentials and privileged secrets out of client code.

### D03. Shared Types & Contracts

Initial responsibilities:
- Shared domain types where appropriate.
- Request and response contracts.
- Shared enums and identifiers.
- AI proposal schemas.

### D04. Validation

Initial responsibilities:
- Input validation.
- Domain validation.
- Request validation.
- Structured AI output validation.
- Database constraints where applicable.

### D05. API / Application Communication

Initial responsibilities:
- Define application interfaces or API conventions.
- Define request and response structures.
- Define error response format.
- Define module interaction contracts.

### D06. Error Handling

Initial responsibilities:
- Validation errors.
- Authentication and authorization errors.
- Not found errors.
- Conflict errors.
- Persistence errors.
- AI provider errors.
- Unexpected errors.

### D07. Logging & Observability

MVP responsibilities:
- Record operational errors.
- Support debugging of failed workflows.
- Avoid logging secrets or unnecessary sensitive user content.

Advanced analytics and observability platforms are deferred unless required for deployment reliability.

### D08. Security & Configuration

Initial responsibilities:
- Environment configuration.
- Server-side authorization.
- User data isolation.
- Input and request-size limits.
- Secret management.
- Safe AI provider integration.

## E. AI CAPABILITY

```text
AI CAPABILITY
│
├── E01. Goal Understanding & Clarification
├── E02. Goal Feasibility Feedback
├── E03. Goal Tree Proposal
├── E04. Proposal Review & Approval
└── E05. Basic Daily Plan Proposal
```

### E01. Goal Understanding & Clarification

AI analyzes the user's description and identifies missing context. It may ask questions about current state, desired outcome, constraints, and optional target timeframe.

### E02. Goal Feasibility Feedback

AI may challenge the user's requested target, timeframe, or workload when the available information suggests a concern.

AI must:
- Explain important assumptions and reasons.
- Present alternatives where useful.
- Avoid claiming certainty when information is insufficient.
- Leave the final decision to the user.

### E03. Goal Tree Proposal

AI proposes a structured breakdown containing relevant:
- Child Goals.
- Milestones.
- Actions.
- Measurements.

The proposal should be sufficiently concrete to help the user understand what to do next, but should avoid unnecessary decomposition.

### E04. Proposal Review & Approval

The user can:
- Accept the complete proposal.
- Accept selected items.
- Edit proposed items.
- Reject proposed items.

Only approved changes are committed as official Goal, Milestone, Action, or Measurement data.

### E05. Basic Daily Plan Proposal

AI may propose a Daily Plan using available Goal, Action, Deadline, progress, and estimated-duration information.

The proposal must be editable and explicitly approved by the user before it becomes the active plan.

## F. DELIVERY & QUALITY

```text
DELIVERY & QUALITY
│
├── F01. Development Environment
├── F02. Code Quality
├── F03. Automated Testing
├── F04. Integration & Repository Workflow
└── F05. Deployment
```

### F01. Development Environment

- Repository setup.
- Environment configuration.
- Dependency installation.
- Local development commands.

### F02. Code Quality

- Type checking where supported.
- Linting.
- Formatting.
- Build validation.

### F03. Automated Testing

- Unit tests.
- Component tests.
- Application/API tests.
- Integration tests.
- End-to-end tests for the core user journey.

### F04. Integration & Repository Workflow

- Branch management.
- Pull requests or equivalent review.
- Contract compatibility checks.
- Integration testing.
- Main branch protection where appropriate.

### F05. Deployment

- Build production application.
- Configure environment.
- Deploy public web application.
- Configure persistent database and authentication services.
- Verify deployed MVP.
- Verify user data isolation and persistence.

---

# 5. MVP SCOPE AND PRIORITY

## 5.1 MVP Core — required

| ID | Capability | MVP expectation |
|---|---|---|
| MVP-001 | Authentication | Email / Password registration and login |
| MVP-002 | Personal Workspace | One personal workspace per user |
| MVP-003 | Project Management | Create and manage multiple Projects |
| MVP-004 | Goal Management | Independent Goals and Project Goals |
| MVP-005 | Goal Hierarchy | Flexible Goal Tree |
| MVP-006 | Milestones | Create and track Goal checkpoints |
| MVP-007 | Actions | Create, plan, update, and complete Actions |
| MVP-008 | Measurements | Define and record basic measurements |
| MVP-009 | AI Goal Assistant | Clarify Goal and propose structured breakdown |
| MVP-010 | Proposal Approval | Review, edit, accept, and reject AI proposals |
| MVP-011 | Manual Planning | User creates and manages Daily Plans |
| MVP-012 | Basic AI Planning | AI proposes a Daily Plan from available data |
| MVP-013 | Scheduling | Store planned date/time and duration |
| MVP-014 | Calendar | Basic view of scheduled Actions |
| MVP-015 | Progress | Display progress using approved rules |
| MVP-016 | Review | Basic planned-versus-actual review |
| MVP-017 | Persistence | Cloud persistence across sessions |
| MVP-018 | Deployment | Publicly accessible web application |
| MVP-019 | Initial Setup Flow | Support Goal-first and Project-first entry paths that converge on the same domain model |
| MVP-020 | Consistent Data Views | Goal, Action, Planning, and Calendar views reflect one authoritative source of truth |

## 5.2 MVP Supporting — minimum necessary

- Application Dashboard.
- Goal Overview with concise progress and next relevant work.
- Goal Tree visualization with expand/collapse.
- Action List.
- Basic Calendar View.
- Loading, Empty, and Error States.
- Basic account settings.
- Seeded demo data or a guided demo scenario if needed for evaluation.

## 5.3 Future Scope — recorded, not designed now

The following are explicitly outside the current MVP. They must not block MVP implementation.

- Team Workspace and collaboration.
- Advanced roles and permission management.
- Custom Data Table builder.
- Mathematics Lab.
- General-purpose algorithm library.
- Arbitrary user-authored formulas.
- AI-generated long-term planning and autonomous plan optimization.
- Autonomous rescheduling after missed work.
- AI changing approved Goals or Deadlines without user approval.
- Advanced notifications and reminders.
- Native mobile applications.
- Complex widget ecosystem.
- Offline-first synchronization and conflict resolution.
- External calendar integrations.
- Advanced analytics and reporting.

Figma concepts such as Mathematics, custom Tables, advanced Chunks, and Widgets remain ideas to evaluate later. Their appearance in a design file does not automatically make them MVP requirements.

---

# 6. CORE USER JOURNEYS

## 6.1 Account and workspace initialization

1. User opens the public web application.
2. User registers or signs in using Email / Password.
3. System resolves the authenticated user.
4. System creates or retrieves that user's Personal Workspace.
5. User enters the application Dashboard.

## 6.2 Initial setup — two valid entry paths

FLOW-UP supports two entry paths. Neither is mandatory for every user:

**Goal-first path**
1. User starts with an outcome they want to achieve.
2. User creates an independent Goal.
3. User may later place it inside a Project.

**Project-first path**
1. User creates a Project to represent a larger initiative.
2. User adds one or more Goals to the Project.
3. Each Goal follows the same Goal clarification and breakdown workflow.

Both paths lead to the same underlying Workspace, Project, and Goal domain model. Do not create separate Goal types or duplicate workflows for the two paths.

## 6.3 Independent Goal creation

1. User chooses to create a Goal without creating a Project.
2. User enters an initial Goal description.
3. AI analyzes the description.
4. AI asks for important missing information.
5. User answers or skips optional questions.
6. AI may provide feasibility feedback.
7. AI proposes a Goal Tree.
8. User reviews, edits, accepts, or rejects proposal items.
9. Approved items are saved as official domain data.
10. The Goal appears in the user's independent Goals area.

## 6.4 Project-based Goal creation

1. User creates a Project.
2. User creates one or more Goals inside the Project.
3. Each Goal can be decomposed and managed using the same Goal workflow.
4. Project overview displays relevant Goal status and progress.

## 6.5 Goal movement

1. User selects a Goal.
2. User chooses a destination Project or the independent Workspace area.
3. System validates ownership and destination.
4. System moves the Goal while preserving identity and valid descendants/relationships.
5. UI refreshes the relevant Workspace and Project views.

## 6.6 Manual Planning

1. User views available Actions.
2. User selects Actions for a day.
3. User sets planned date and optional time/duration.
4. User saves the Daily Plan.
5. The plan is visible in Planning and Calendar views.

## 6.7 AI-assisted Planning

1. User requests a Daily Plan.
2. System gathers relevant approved Goal, Action, Deadline, progress, and duration data.
3. AI proposes a plan.
4. System validates the proposal.
5. User reviews and edits the proposal.
6. User approves it.
7. System saves approved Schedule/Plan data through normal application operations.

## 6.8 Execution, Progress, and Review

1. User opens a planned Action.
2. User updates its status or marks it complete.
3. User records Measurement values where relevant.
4. Progress Engine calculates updated progress using approved rules.
5. Goal Overview and relevant Project views update.
6. User reviews planned versus actual execution.
7. User may revise Goals, Actions, or future plans.

---

# 7. HIGH-LEVEL DEPENDENCY MAP

The architecture tree shows containment. This section shows important conceptual dependencies.

```text
AUTHENTICATED USER
       │
       ▼
PERSONAL WORKSPACE
       │
       ├─────────────── PROJECTS (optional)
       │                    │
       └─────────────── GOALS
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
           CHILD GOALS  MILESTONES  MEASUREMENTS
                │           │
                └─────┬─────┘
                      ▼
                    ACTIONS
                      │
                      ▼
                 PLANNING
                      │
                      ▼
                  SCHEDULES
                      │
                      ▼
                EXECUTION DATA
                      │
             ┌────────┴────────┐
             ▼                 ▼
         PROGRESS            REVIEW

AI CAPABILITY
   ├── reads relevant approved context
   ├── proposes Goal / Milestone / Action / Measurement structures
   └── proposes Daily Plans
              │
              ▼
       USER REVIEW & APPROVAL
              │
              ▼
       NORMAL APPLICATION FLOWS
```

Important principles:
- Project is optional; Goal can exist directly in the Personal Workspace.
- Goal Tree is a view of Goal hierarchy data, not a separate source of truth.
- Calendar is a view over Schedule and Action data.
- Planning and Schedule are related but must have clearly defined responsibilities.
- Progress UI displays authoritative calculated results; it is not an independent source of progress truth.
- AI proposal data is separate from approved domain data.
- Initial Setup may begin from Project creation or direct Goal creation; both converge on the same domain operations.
- Calendar is a time-oriented view over Schedule entries and their linked Actions. Calendar edits must invoke the same Planning/Scheduling use cases as other interfaces.
- Changes must propagate through authoritative data and shared read models/query refresh. Do not synchronize independent copies of the same Goal, Action, or Schedule across pages.
- The friend's proposed Chunks, Docs, Widget, Mathematics, and custom Data Table concepts are not yet defined sufficiently to become domain entities or MVP modules. Preserve them as future concepts pending explicit product definition.

- Exact module contracts must be specified before dependent modules are implemented.

---

# 8. MVP ACCEPTANCE CRITERIA

The MVP is not complete merely because screens exist. The following end-to-end conditions must pass.

## 8.1 Identity and persistence

- A user can register and sign in with Email / Password.
- The user's Personal Workspace is created or retrieved reliably.
- Data remains after refresh and a later login.
- A user cannot access another user's private data.

## 8.2 Goal and Project

- A user can create an independent Goal.
- A user can create a Project and Goals inside it.
- A user can create child Goals.
- A user can view a compact overview and expand Goal details.
- A user can move a Goal between independent Workspace scope and a Project without data loss.

## 8.3 AI Goal Assistant

- A user can submit a natural-language Goal.
- AI can ask clarification questions.
- AI can return a structured proposal.
- The proposal includes relevant Goal, Milestone, Action, and Measurement suggestions where appropriate.
- Invalid AI output is rejected or safely handled.
- The user can edit, accept, partially accept, or reject proposal items.
- Unapproved AI output is not written as official business data.
- The core Goal workflow remains usable without AI availability.

## 8.4 Planning and execution

- A user can create a Daily Plan manually.
- AI can propose a basic Daily Plan using available information.
- The user can edit and approve the proposal.
- Approved planned Actions appear in the relevant Planning/Calendar view.
- A user can update and complete Actions.

## 8.5 Progress and review

- Measurement values can be recorded and retrieved.
- Progress is calculated according to approved rules.
- User can inspect current Goal progress.
- User can compare planned and actual execution at a basic level.

---

# 9. FUNCTION SPECIFICATION STANDARD

Every function selected for implementation must receive a detailed specification inside this blueprint.

## Function specification template

**Function ID:** FUNC-XXX  
**Name:**  
**System Area / Module:**  
**Architecture Status:** PROPOSED  
**Development Status:** AVAILABLE / BLOCKED  
**Assignee:** Unassigned

### 1. Purpose
What problem does this function solve?

### 2. Responsibility
What does this function do? What does it explicitly not do?

### 3. User interaction
- Entry point.
- User action.
- Expected UI behavior.
- Success state.
- Failure state.

### 4. Inputs
List required and optional inputs, types, and constraints.

### 5. Outputs
Define returned data or visible result.

### 6. Business rules
List rules and invariants that must be enforced.

### 7. Internal processing
Describe the operation step by step.

### 8. Data requirements
- Entities.
- Fields.
- Relationships.
- Read operations.
- Write operations.
- Transaction requirements.

### 9. Interfaces
- API endpoint or application interface.
- Request structure.
- Response structure.
- Error structure.
- Dependencies.

### 10. Implementation breakdown
List expected components, files, and implementation units after the technology stack and repository structure are approved.

Do not invent file paths before the repository structure and technology stack are approved.

### 11. Error handling
List expected failure cases and their handling.

### 12. Tests
Define unit, integration, and user-flow tests.

### 13. Acceptance criteria
Define observable conditions for completion.

### 14. Integration notes
Identify modules affected by this function.

### 15. Development handoff
- Developer / AI assignee.
- Required references.
- Allowed scope.
- Restricted scope.
- Deliverables.
- Review status.

---

# 10. DEVELOPMENT BOARD

All implementation work is tracked here. Add rows as functions are specified and approved. Do not mark work `AVAILABLE` while required design or dependencies are unresolved.

| ID | Function / Task | Module | Design Status | Development Status | Assignee |
|---|---|---|---|---|---|
| TBD | Repository and environment setup | Delivery | OPEN | BLOCKED | Unassigned |
| TBD | Authentication and user context | Identity | OPEN | BLOCKED | Unassigned |
| TBD | Personal Workspace initialization | Workspace | OPEN | BLOCKED | Unassigned |
| TBD | Project CRUD | Project | OPEN | BLOCKED | Unassigned |
| TBD | Independent and Project Goal model | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Goal hierarchy operations | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Goal movement between scopes | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Milestone management | Milestone | OPEN | BLOCKED | Unassigned |
| TBD | Action management | Action | OPEN | BLOCKED | Unassigned |
| TBD | Measurement management | Measurement | OPEN | BLOCKED | Unassigned |
| TBD | Manual Daily Planning | Planning | OPEN | BLOCKED | Unassigned |
| TBD | Schedule management | Scheduling | OPEN | BLOCKED | Unassigned |
| TBD | AI Goal Assistant | AI | OPEN | BLOCKED | Unassigned |
| TBD | AI proposal approval workflow | AI / Goal | OPEN | BLOCKED | Unassigned |
| TBD | Basic AI Daily Plan proposal | AI / Planning | OPEN | BLOCKED | Unassigned |
| TBD | Progress calculation | Progress | OPEN | BLOCKED | Unassigned |
| TBD | Basic Review | Review | OPEN | BLOCKED | Unassigned |
| TBD | End-to-end MVP deployment | Delivery | OPEN | BLOCKED | Unassigned |

A task is `AVAILABLE` only when its required design and dependencies are approved.

Each task has one primary assignee. Other contributors may support or review it.

---

# 11. DEVELOPMENT SESSION MANAGEMENT

Every substantial development session is recorded here. Keep session records concise but sufficient for another developer or AI session to continue without guessing.

## Session template

**Session ID:** SES-XXX  
**Title:**  
**Assignee:**  
**Related Function(s):**  
**Status:** AVAILABLE

### Objective
What must be completed?

### Architecture references
Which sections of this blueprint must be read?

### Prerequisites
What must already exist?

### Scope
What can be modified?

### Out of scope
What must not be modified?

### Implementation plan
Ordered development steps.

### Deliverables
- Source code.
- Tests.
- Updates to this blueprint.
- Pull request / commit reference.

### Verification
- Build.
- Type check.
- Lint.
- Tests.
- Integration verification.

### Session result
- Completed work.
- Remaining work.
- Discovered issues.
- Architecture changes proposed.
- Next recommended task.

---

# 12. DECISION REGISTER

Only decisions explicitly approved by the Product Owner are `APPROVED`. Recommendations are not approvals.

| ID | Decision | Status | Impact / Notes |
|---|---|---|---|
| DEC-001 | MVP is single-person; team collaboration is future scope | APPROVED | Product, Identity, Workspace |
| DEC-002 | One Personal Workspace per User | APPROVED | Identity, Workspace, Database |
| DEC-003 | Workspace supports independent Goals and Projects | APPROVED | Workspace, Goal, Project |
| DEC-004 | Project is optional for a Goal | APPROVED | Goal, Project |
| DEC-005 | A Goal can move between independent Workspace scope and a Project | APPROVED | Goal, Project, Data integrity |
| DEC-006 | Email / Password authentication | APPROVED | Identity |
| DEC-007 | Goal hierarchy can have flexible depth | APPROVED | Goal, UI, Database |
| DEC-008 | Goal, Milestone, and Action have distinct responsibilities | APPROVED | Goal, Milestone, Action |
| DEC-009 | AI proposes structured Goal breakdown; user reviews and approves | APPROVED | AI, Goal, Milestone, Action, Measurement |
| DEC-010 | AI may challenge feasibility and suggest alternatives; user decides | APPROVED | AI, Goal |
| DEC-011 | Goal deadline / expected completion time is optional | APPROVED | Goal, Planning |
| DEC-012 | Manual Planning and AI-assisted Planning share one Planning model | APPROVED | Planning, AI, Schedule |
| DEC-013 | Basic AI Daily Plan proposal is included in MVP | APPROVED | AI, Planning |
| DEC-014 | AI proposals do not become official data before user approval | APPROVED | AI, Application, Domain |
| DEC-015 | A Goal may have multiple Measurement definitions | OPEN | Measurement, Goal, Progress; proposed by assistant, not yet explicitly confirmed |
| DEC-016 | Action association cardinality and ownership rules | OPEN | Action, Goal, Milestone |
| DEC-017 | Schedule cardinality, recurrence, and time-zone rules | OPEN | Planning, Schedule |
| DEC-018 | Progress calculation and aggregation rules | OPEN | Measurement, Progress |
| DEC-019 | Technology stack | OPEN | All implementation areas |
| DEC-020 | Database and hosting provider | OPEN | Infrastructure, Deployment |
| DEC-021 | AI provider and model selection | OPEN | AI, Infrastructure |
| DEC-022 | Goal / Milestone / Action status lifecycle | OPEN | Domain, UI, Progress |
| DEC-023 | Project completion and progress aggregation rules | OPEN | Project, Progress |

## 12.1 Decision approval rule

Before changing an `OPEN` decision to `APPROVED`:
1. Present the concrete options or recommendation.
2. Explain meaningful MVP impact.
3. Obtain explicit Product Owner approval.
4. Record the chosen rule and consequences here.
5. Update affected architecture sections.

---

# 13. MVP BUILD ORDER

This is the recommended build sequence, not permission to implement underspecified modules. Detailed dependencies may change after Domain Model and Technology Stack approval.

## Phase 1 — Technical Foundation

- Approve technology stack and providers.
- Set up repository and application structure.
- Configure environment and deployment foundations.
- Configure authentication integration.
- Configure database and migration mechanism.
- Establish protected data access.
- Build application shell and basic navigation.

## Phase 2 — Workspace, Project, and Goal Foundation

- Initialize Personal Workspace.
- Create and manage Projects.
- Create independent Goals.
- Create Project Goals.
- Implement Goal hierarchy.
- Implement Goal movement between scopes.
- Build Goal Overview and basic Goal Tree views.

## Phase 3 — Goal Structure and Execution

- Implement Milestones.
- Implement Actions.
- Define and implement Action associations.
- Update Action status and completion.
- Build basic Action List and detail views.

## Phase 4 — Measurement and Progress

- Implement Measurement definitions and records.
- Approve and implement progress calculation rules.
- Display Goal and Project progress where applicable.
- Add measurement history.

## Phase 5 — Planning and Calendar

- Implement manual Daily Planning.
- Implement Schedule operations.
- Build basic Calendar view.
- Connect Action execution with planned work.

## Phase 6 — AI Core

- Implement Goal clarification flow.
- Implement feasibility feedback.
- Implement structured Goal Tree proposals.
- Implement proposal validation and user approval.
- Implement basic AI Daily Plan proposal.
- Add graceful AI failure handling.

The AI Goal Assistant is a core MVP capability. It must not be silently dropped to make the build appear complete. If time becomes constrained, reduce non-core UI polish or advanced planning behavior before removing the core AI Goal workflow.

## Phase 7 — Review and MVP Integration

- Implement basic Review.
- Complete the end-to-end user journey.
- Validate persistence and data isolation.
- Test AI approval boundaries.
- Test core workflow without AI availability.
- Seed demo data if needed.
- Deploy and verify the public MVP.

---

# 14. FUTURE SCOPE REGISTER

These ideas are recorded for later evaluation only. They are not current implementation tasks.

| ID | Future capability | Reason deferred |
|---|---|---|
| FUT-001 | Team Workspace and collaboration | MVP is single-person |
| FUT-002 | Advanced roles and permissions | Not needed for personal MVP |
| FUT-003 | Custom Data Table builder | Separate product capability; high scope |
| FUT-004 | Mathematics Lab | Separate experimentation capability |
| FUT-005 | General-purpose algorithm library | Not needed for core goal execution |
| FUT-006 | Arbitrary formula engine | Adds complexity to data and security |
| FUT-007 | AI long-term planning optimization | Start with Goal breakdown and basic Daily Plan |
| FUT-008 | Autonomous rescheduling | User approval and basic planning first |
| FUT-009 | Advanced availability and calendar optimization | Detailed availability modeling deferred |
| FUT-010 | Advanced notifications | Not essential to validate core loop |
| FUT-011 | Complex widget ecosystem | Not essential to MVP |
| FUT-012 | Native mobile applications | Public web MVP first |
| FUT-013 | Offline-first synchronization | Adds conflict-resolution complexity |
| FUT-014 | External calendar integration | Basic internal Schedule first |
| FUT-015 | Advanced analytics | Basic Progress and Review first |

---

# 15. OPEN ARCHITECTURE QUESTIONS

The following decisions remain open and must be resolved when their relevant modules are designed.

1. Measurement cardinality, supported data types, and history model.
2. Whether Actions can associate with one or multiple Goals / Milestones.
3. Whether an Action can have multiple Schedule entries.
4. Whether Daily Plan is a persisted entity or a date-based view over Schedule entries.
5. Action and Milestone status lifecycle.
6. Goal progress calculation and child aggregation rules.
7. Project progress aggregation rules.
8. Time-zone and date-only handling.
9. Technology stack.
10. Database, hosting, and authentication provider.
11. AI provider, model, structured output strategy, and cost limits.
12. Exact API / application interface strategy.
13. Deletion, archive, and data-retention behavior.

An open question does not block unrelated architecture work. It blocks only the affected module or implementation task.

---

# 16. CHANGE LOG

| Version | Date | Changes |
|---|---|---|
| 0.3 | 2026-11-16 | High-level MVP architecture and initial module map. |
| 0.4 | 2026-11-16 | Added contents; merged Project-first/Goal-first setup, single-source-of-truth data routing, overview-first stage progress, and Calendar–Schedule–Action integration; documented deferred friend-design concepts; added UI/UX foundations, ready-to-code specification contract, and new-chat handoff protocol. |

---

# 17. CURRENT ARCHITECTURE AND DEVELOPMENT STATE

## 16.1 Current stage

**Current stage:** Product baseline, MVP scope, and high-level module map approved; detailed technical design and code-ready part specifications are next.

**Implementation started:** Not confirmed in this blueprint.

## 16.2 Layer status

| Layer | Scope | Architecture status | Development status |
|---|---|---|---|
| L0 | Product vision, core loop, MVP objective | APPROVED | NOT STARTED |
| L1 | High-level system areas and boundaries | APPROVED | NOT STARTED |
| L2 | Module map and high-level boundaries | APPROVED (HIGH LEVEL) | NOT STARTED |
| L3 | Component and function specifications | NOT_STARTED | NOT STARTED |
| L4 | Implementation specifications | NOT_STARTED | NOT STARTED |
| L5 | Tasks and development sessions | TEMPLATE_READY | NOT STARTED |
| Domain Model | Entities, attributes, relationships, invariants | NOT_STARTED | NOT STARTED |
| Database Schema | Tables, constraints, indexes, migrations, access policies | NOT_STARTED | NOT STARTED |
| API Contracts | Operations, request/response, errors | NOT_STARTED | NOT STARTED |
| AI Technical Design | Prompts, schemas, validation, approval workflow | NOT_STARTED | NOT STARTED |
| Testing Architecture | Test strategy and acceptance coverage | NOT_STARTED | NOT STARTED |

## 16.3 What is approved now

- Single-person MVP.
- One Personal Workspace per User.
- Independent Goals and optional Projects.
- Goals can be moved between independent Workspace scope and a Project.
- Flexible-depth Goal hierarchy.
- Goal, Milestone, and Action are distinct concepts.
- Email / Password authentication method.
- AI proposes a Goal Tree and asks clarification questions where needed.
- AI may challenge feasibility and suggest alternatives; the user decides.
- AI proposal must be reviewed and approved before saving as official data.
- Manual and AI-assisted Planning share a common Planning model.
- Basic AI Daily Plan proposal is included in MVP.
- Goal deadline / expected completion time is optional.
- Overview-first UX: users see the overall outcome and what matters next, then expand details.

## 16.4 What is not approved yet

- Full technology stack.
- Supabase or another specific database/auth provider.
- AI provider and model.
- Exact database schema.
- Exact API contracts.
- Measurement schema and cardinality.
- Action association rules.
- Schedule cardinality and recurrence.
- Progress formulas.
- Detailed component architecture.

## 16.5 Next work

The next architecture phase is **Domain Model Design**, followed by the technical contracts required to make each implementation part independently code-ready.

Design in this order:
1. Define entities and their responsibilities.
2. Define attributes and data types.
3. Define relationships and cardinality.
4. Define invariants, validation, and status lifecycles.
5. Review the model against all approved MVP journeys.
6. Approve the Domain Model before deriving the database schema.
7. Design database schema, constraints, indexes, migrations, and access policies.
8. Define application/use-case and API contracts.
9. Define AI proposal schemas, validation, and approval workflows.
10. Define frontend information architecture, component contracts, design tokens, and interaction states.
11. Define testing and deployment specifications.
12. Break each module into bounded READY_TO_CODE parts.

**Architecture principle:** Build only what the MVP needs, but specify every implemented part sufficiently that another developer or AI session can build it without guessing.

---



---

# 18. UI/UX FOUNDATION PRINCIPLES

This section defines the product and architecture foundations required for a polished, intelligent UI later. It does not freeze visual styling, branding, or final screen layouts.

## 17.1 UX direction

FLOW-UP should feel like a guided goal-execution workspace, not a generic task list and not a dense project-management cockpit.

The interface should make three questions easy to answer:
1. What outcome am I working toward?
2. Where am I now, and what is the next meaningful step?
3. What can I do next?

## 17.2 Overview-first information hierarchy

The default view for a Goal should prioritize:
1. Goal title and desired outcome.
2. Current progress/status, with the basis of the progress clearly understandable.
3. Next relevant Milestone or checkpoint.
4. Next executable Action.
5. Deadline or expected period, if provided.
6. Supporting Goal Tree and detailed records, collapsed or progressively disclosed.

The interface must not present the entire Goal Tree as an unavoidable wall of nodes.

## 17.3 Progressive disclosure

- Start with a compact overview.
- Expand child Goals, Milestones, Actions, and measurement details only when needed.
- Preserve context when moving between overview and detail.
- Avoid making users navigate through many pages to perform a common action.
- Do not hide important state changes behind decorative animations.

## 17.4 Shared design system foundation

Before detailed visual design, implement reusable foundations:
- Semantic design tokens for color, spacing, typography, radius, elevation, and motion.
- Consistent typography hierarchy.
- Responsive layout primitives.
- Shared buttons, inputs, selects, dialogs, menus, cards, badges, tabs, tooltips, and feedback patterns.
- Consistent loading, empty, error, success, disabled, and confirmation states.
- Keyboard accessibility and visible focus states.
- Reusable page shell, navigation, content container, and responsive breakpoints.

Exact token values, component library, and visual theme remain technical/UI design decisions and must be approved before implementation.

## 17.5 Smart UX without premature complexity

- AI suggestions must be visually distinguishable from saved/approved data.
- Every AI proposal must explain what it will change before applying it.
- Destructive or structurally significant operations require clear confirmation.
- Use sensible defaults, but expose the ability to edit them.
- Keep user actions reversible where practical.
- Do not introduce a complex widget builder or customizable dashboard into MVP merely to make the interface look powerful.

## 17.6 Responsive baseline

MVP is a web application. Design the layout to work on desktop and remain usable on tablet/mobile widths. This does not imply a native mobile application or offline support.

---

# 19. READY-TO-CODE PART SPECIFICATION CONTRACT

The purpose of detailed architecture is that a developer or a fresh ChatGPT session can implement one bounded part without guessing or needing the full history of prior conversations.

A part is not `READY_TO_CODE` until its specification contains the information below or explicitly marks an item as not applicable.

## 18.1 Required specification fields

| Field | Required content |
|---|---|
| Part ID and name | Stable identifier, e.g. `B03-UC-001` |
| Purpose | User/business problem solved |
| Scope | Included and excluded behaviour |
| Owner layer/module | The authoritative module responsible |
| Dependencies | Required modules and their approved contracts |
| User flow | Trigger, steps, outcomes, alternate paths |
| UI contract | Screens/components, states, user actions, accessibility expectations |
| Domain contract | Entities, relationships, invariants, state transitions |
| Data contract | Fields, types, nullability, constraints, ownership |
| API/use-case contract | Inputs, outputs, authorization, side effects |
| Validation | Client and authoritative server/domain validation |
| Error behaviour | Expected errors and user-visible recovery |
| Security | Ownership checks, trust boundaries, sensitive data handling |
| AI behaviour | Prompt/input/output schema and approval gate, if applicable |
| Acceptance criteria | Observable, testable pass conditions |
| Tests | Unit, integration, component, and/or end-to-end cases |
| Files to create/change | Expected repository paths and responsibilities |
| Implementation steps | Ordered small steps |
| Completion evidence | Commands run, tests passed, screenshots/logs where relevant |
| Status | PROPOSED / IN_REVIEW / APPROVED / READY_TO_CODE / IMPLEMENTED / VERIFIED |

## 18.2 Implementation readiness rule

A part may be handed to a coding session only when:
- Its parent architecture and relevant decisions are approved.
- Its dependencies have stable contracts.
- No unresolved question changes the core behaviour of that part.
- Acceptance criteria are testable.
- The target repository structure and current implementation state are known.
- The part has a bounded scope that can be implemented and verified independently.

If an unresolved decision is non-blocking, document the chosen temporary boundary and do not invent a permanent business rule.

## 18.3 Part boundaries

A part should represent one cohesive capability, not an arbitrary number of files.

Examples:
- Authentication: registration flow.
- Workspace: retrieve or initialize Personal Workspace.
- Goal Management: create a Goal.
- Goal Management: move a Goal between Project and independent scope.
- Goal Tree: retrieve and render hierarchy.
- Planning: add an Action to a Daily Plan.
- AI: validate a Goal Tree proposal.
- Calendar: retrieve Schedule entries for a date range.

Avoid a single giant task such as "build the entire frontend" or "implement all Goal features."

## 18.4 Definition of Done

A part is complete only when:
1. Implementation matches the approved specification.
2. No unapproved scope has been added.
3. Validation and authorization are enforced at the authoritative boundary.
4. Relevant automated tests pass.
5. Error, loading, empty, and success states are handled where applicable.
6. Types/contracts remain consistent with dependent modules.
7. The application builds and relevant lint/type checks pass.
8. The Master Blueprint status and session notes are updated.
9. Any deviation or follow-up is recorded.

---

# 20. NEW-CHAT HANDOFF PROTOCOL

A new chat must be able to work from a self-contained part specification, not rely on memory or assume that previous conversations are available.

## 19.1 Required handoff package

When starting a new implementation chat, provide:
1. The current `MASTER_BLUEPRINT.md`.
2. The exact Part ID and complete approved part specification.
3. Relevant existing source files or repository access.
4. Current branch and commit, if applicable.
5. Known constraints and any implementation already completed.
6. The exact requested deliverable for that session.

## 19.2 Coding-session instructions

The coding session must:
- Read the Master Blueprint and the assigned part specification first.
- Inspect the existing repository before proposing file changes.
- Preserve existing conventions unless the specification approves a change.
- Implement only the assigned part and necessary integration points.
- Never invent missing business rules or silently widen scope.
- Ask one focused clarification if a blocking ambiguity exists.
- Explain important design choices and provide a concise file/change summary.
- Run the specified tests and report exact results.
- Identify incomplete work, risks, and required follow-up.
- Return a handoff update suitable for insertion into this Master Blueprint.

## 19.3 Handoff response format

```text
PART:
SPEC VERSION:
IMPLEMENTATION STATUS:
FILES CREATED:
FILES MODIFIED:
BEHAVIOUR IMPLEMENTED:
TESTS / COMMANDS RUN:
TEST RESULTS:
KNOWN LIMITATIONS:
DEVIATIONS FROM SPEC:
FOLLOW-UP TASKS:
BLUEPRINT UPDATES REQUIRED:
```

A chat response is not proof that code was committed or deployed. Report repository changes only when actually performed and verified.

---

# 21. FRIEND DESIGN INTEGRATION NOTES

This section records how the additional concept design was evaluated. It preserves potentially useful ideas without treating undefined labels as approved architecture.

## 20.1 Concepts merged into the current product baseline

| Friend-design concept | FLOW-UP integration | Status |
|---|---|---|
| Create Project first, then add Goals | Supported as Project-first entry path | MERGED |
| Start directly from a Goal | Supported as Goal-first entry path | MERGED |
| System routes updates to relevant areas | Implement through authoritative domain/application data and refreshed views | MERGED AS PRINCIPLE |
| Goal Tree overview and progress stage | Overview-first Goal experience with current progress, next checkpoint, and next Action | MERGED |
| Calendar connected to Goals and Actions | Calendar reads/updates Schedule and linked Action through shared use cases | MERGED |
| Calendar can add planned work | Supported where it creates/updates the same Schedule/Action records | MERGED |

## 20.2 Concepts retained for later definition

| Concept | Current treatment | Reason |
|---|---|---|
| Chunks 1/2/3 | UNRESOLVED / FUTURE CONCEPT | Meaning, ownership, and lifecycle have not been defined |
| Docs | UNRESOLVED / FUTURE CONCEPT | Not yet clear whether this means notes, structured documents, or a document editor |
| Widget system | FUTURE SCOPE | Widget types, data contracts, permissions, and user value need definition |
| Custom Data Table | FUTURE SCOPE | Not equivalent to basic Goal Measurement |
| Mathematics / algorithm library | FUTURE SCOPE | General formula and algorithm execution are not required for the MVP core loop |
| Automatic notifications for days without a Goal | FUTURE SCOPE | Reminder policy and notification preferences are undefined |
| Multiple Goal Tree types | UNRESOLVED | Current model has one Goal hierarchy with different views; no second independent tree is approved |

## 20.3 Data routing rule

The phrase "information is routed to the correct places" is implemented as follows:

- Each fact is written to its owning domain record through an application use case.
- Other views query or derive the information from that authoritative record.
- Derived summaries may be cached only when invalidation/consistency behaviour is specified.
- No page, widget, Chunk, or calendar view may become an independent competing owner of Goal/Action/Schedule facts.
- Notes and future documents may own their own content, but references to Goals or Actions must use stable identifiers and defined relationships.

## 20.4 Measurement versus custom Data Table

These are distinct capabilities:

- **MVP Measurement:** a focused way to define a metric related to a Goal and record values/history.
- **Future Custom Data Table:** a user-configurable data structure with arbitrary columns, formulas, query/algorithm behaviour, and possibly relationships to widgets.

The MVP must implement Measurement without accidentally creating a general-purpose table/formula engine.


---

**END OF MASTER BLUEPRINT — v0.4**

# IMPLEMENTATION ADDENDUM — 2026-11-18

This addendum records verified repository implementation status. It does not change unresolved product or domain decisions in v0.4.

## Product evolution and current slice

FLOW-UP now includes an optional, event-triggered AI Goal Discovery path within the existing authenticated application. The user can submit an intention, inspect a structured interpretation and clarification questions, request feasibility feedback, edit/select a Goal/Milestone/Action proposal, and explicitly approve application. AI results remain separate from official domain data until approval. Users can continue manually when AI is unavailable.

The source inventory and concept-by-concept reconciliation are recorded in `docs/FLOW_UP_PRODUCT_EVOLUTION_AUDIT.md`. Local setup and current limitations are documented in `docs/LOCAL_DEMO.md`.

## Module and persistence status

- **B10:** Added a server-side Gemini provider adapter, operation schemas, output validation, proposal persistence, daily usage limits, and authenticated API routes. B10 persists proposals and usage counters in its own `ai_proposals` and `ai_usage` tables.
- **B03–B05:** Approved proposal items are applied through existing Goal, Milestone, and Action services. B10 does not write to their tables directly.
- **A10:** Added the structured Goal Discovery and proposal review screen to the existing React application. It distinguishes AI proposals from saved records and offers a manual route.
- **Database/API:** Added additive SQLite tables and routes for understanding, feasibility, proposal creation/retrieval/edit/reject/apply. Existing API authentication and response envelopes are reused.
- **Dependencies/configuration:** Added `@google/genai` 3.5.0. `GEMINI_API_KEY` remains server-only. Model, timeout, per-user limit and global limit use environment configuration.

Proposal application uses a database compare-and-set state transition to prevent concurrent approval from applying twice. Item results are retained and partial results can be retried without reapplying successful items. A process crash while a proposal is in `APPLYING` still needs an explicit recovery policy; do not represent this as crash-proof exactly-once execution.

## AI behavior and provider status

- Model configured by default: `gemini-3.8-flash`.
- Implemented operations: goal understanding/clarification, feasibility feedback, structured Goal/Milestone/Action proposal, explicit review and application.
- Structured output uses provider JSON Schema plus server-side semantic validation.
- Limits: 4,000 input characters, 18 proposal items, 20-second default timeout (configurable up to 60 seconds), 12 calls per user per UTC day and 90 calls globally per UTC day by default.
- Missing key, invalid output, provider errors, timeout and rate limiting return clear errors without blocking manual Goal workflows.
- Every clarification extraction remains `NEEDS_CONFIRMATION`; structures remain `AI_PROPOSED` until user approval.
- Google confirms Gemini 3.8 Flash is stable and documents `@google/genai` and structured outputs. Free-tier availability/rates vary, may change, and Google may use Free-tier content to improve products. The UI discloses this and warns against sending sensitive information.
- **Live Gemini request: NOT VERIFIED.** No provider key was configured for this session. Mocked provider responses were used for automated end-to-end tests.

## Verification evidence

- Frontend typecheck: PASS.
- Backend typecheck: PASS.
- Frontend tests: PASS, 4 tests.
- Backend tests: PASS, 185 tests across 39 files.
- Production build: PASS, emitted to a temporary directory.
- Full repository lint: FAIL, 19 existing errors in domain/service/test/scratch files. Focused lint for the new/modified AI, route, server, and frontend implementation passed.
- Fresh SQLite initialization: PASS on a temporary database.
- Backend startup and health check: PASS.
- Frontend startup and frontend-to-backend proxy/API requests: PASS.
- Manual account registration, workspace creation, Goal persistence/read and AI-unavailable fallback: PASS.
- Mocked discovery → feasibility → proposal → approval → Goal/Milestone/Action persistence across server restart: PASS. Duplicate approval was rejected.
- Browser-driven E2E: NOT RUN; the repository has no configured browser E2E runner.
- Existing `data/flow-up.db` was not used or modified for runtime verification.

## Remaining work and open decisions

- Complete Measurement HTTP routes/UI before claiming the Measurement workflow is integrated.
- Define durable recovery for proposals left in `APPLYING` after process failure.
- AI Daily Plan, AI Review/improvement and adjustment proposals are not implemented.
- Review routes/UI and authoritative progress behavior remain constrained by existing C08/C09 decisions.
- Core/Critical Goal, Stage/Chunk, resource persistence, risk persistence and Docs/Notes ownership remain OPEN as documented in the audit.
- Real Gemini provider success, timeout and quota behavior still need a keyed environment test; normal test runs remain deterministic and mocked.
- Resolve the 19 repository lint errors in a separately scoped cleanup.

## Implementation update — Measurement and focused execution surfaces (2026-11-18)

This implementation update records the current web MVP state. It supersedes earlier remaining-work bullets above where they state that Measurement routes/UI are absent or that AI proposals only apply Goal/Milestone/Action. It does not close the still-open C08/C09 progress and review decisions.

### B06 Measurement

- Authenticated HTTP operations now create/list/get/update/archive definitions, append typed values, and retrieve current value/history through the existing B06 service.
- SQLite storage is additive and idempotently initialized with `measurements` and `measurement_records`; existing rows/tables are not reset.
- MVP accepted types are `NUMBER`, `TEXT`, and `BOOLEAN`. Units are numeric-only. Records are immutable; unit changes are rejected after values exist.
- Current value resolves deterministically by descending `recordedAt`, then `createdAt`, then ID. This is an implementation policy for the current UI, not a baseline/target-direction rule.
- The Goal detail UI supports create/edit, value capture, history, and a numeric sparkline only when at least two values exist.

### B08 Progress and review boundaries

- The API reports an Action completion metric using completed active Actions divided by total active Actions. Empty Action sets are `NOT_APPLICABLE`, not zero percent.
- This metric is labeled “Actions complete” and is not used as Goal outcome progress.
- Goal outcome percentage and Measurement target progress remain `RULE_NOT_CONFIGURED` while target direction and mixed-source aggregation remain OPEN. Current and target values may be displayed, but no inferred percentage is produced.
- Review progress reads return actual B05/B06 evidence. Persisted review notes/history and the complete Review interface remain unimplemented.

### B10 and connected UI

- User-approved Goal Tree proposals may now include Measurement definitions. B10 validates them and applies through B06; it does not mutate B06 tables directly.
- The home surface reads existing Actions and Schedules for its next Action and upcoming work and shows loading, error, and empty states.
- Goal Tree nodes expand independently. Unfinished Milestones and Actions can be edited in the Goal detail view.
- Goal discovery preserves draft input in tab-scoped session storage and guards concurrent AI requests. Gemini remains optional; manual workflows are unchanged.

### Verification status

- Frontend/backend typechecks, 6 frontend tests, 185 backend tests, focused lint, and production build passed after the implementation.
- API integration tests cover Measurement authorization, cross-user denial, validation, persistence across restart, and AI proposal application.
- Live Gemini verification was attempted with configured credentials but outbound network access failed with `EACCES`; browser-driven E2E remains unavailable in this repository.
