exports.error = {
  auth: {
    unauthorized: "Not authorized",
    forbidden: "Forbidden",
    accessDenied: "Access denied",
    emailNotExists: "Email does not exist",
    invalidCredentials: "Invalid credentials",
    incorrectPassword: "Incorrect password",
    incorrectOldPassword: "Incorrect old password",
  },
  boxSpecification: {
    notFound: "Box specification not found",
    cannotBeDeleted: "Box specification cannot be deleted",
    alreadyHaveEstimation: "Box specification already have an estimation",
    notHaveQuantity: "Box specification does not have any quantity",
  },
  boxStyle: {
    notFound: "Box style not found",
    titleExists: "Box style title already exists",
    assignedOnBoxSpecification: "Box style is assigned on box specification",
  },
  brand: {
    notFound: "Brand not found",
    titleExists: "Brand title already exists",
    acronymExists: "Brand acronym already exists",
    assignedOnUser: "Brand is assigned on user",
  },
  comment: {
    notFound: "Comment not found",
  },
  deal: {
    notFound: "Deal not found",
  },
  dealStatus: {
    notFound: "Deal status not found",
    titleExists: "Deal status title already exists",
    defaultNotExists: "Default deal status does not exist",
    assignedOnDeal: "Deal status is assigned on deal",
    cannotDeleteDefaultDealStatus: "Default deal status cannot be deleted",
  },
  department: {
    notFound: "Department not found",
    titleExists: "Department title already exists",
    assignedOnUser: "Department is assigned on user",
  },
  email: {
    customerEmailMissing: "Customer's email is missing",
    quotationEmailAlreadySent: "Quotation email has been sent already",
  },
  emailTemplate: {
    notFound: "Email template not found",
    alreadyExistsInBrand: "Email template already exists in brand",
    invalidPlaceholderKeysUsed: "Invalid placeholder keys used",
  },
  estimation: {
    notFound: "Estimation not found",
    notHaveQuantity: "Estimation does not have any quantity",
  },
  foiling: {
    notFound: "Foiling not found",
    titleExists: "Foiling title already exists",
    assignedOnBoxSpecification: "Foiling is assigned on box specification",
  },
  grammage: {
    notFound: "Grammage not found",
    titleExists: "Grammage title already exists",
    assignedOnBoxSpecification: "Grammage is assigned on box specification",
  },
  insidePrinting: {
    notFound: "Inside printing not found",
    titleExists: "Inside printing title already exists",
    assignedOnBoxSpecification:
      "Inside printing is assigned on box specification",
  },
  lamination: {
    notFound: "Lamination not found",
    titleExists: "Lamination title already exists",
    assignedOnBoxSpecification: "Lamination is assigned on box specification",
  },
  lead: {
    notFound: "Lead not found",
    notFoundInBrand: "Lead not found in brand",
    notAssignedToCsr: "Lead not assigned to csr",
    emailExists: "Lead email already exists",
    phoneExists: "Lead phone already exists",
  },
  leadSource: {
    notFound: "Lead source not found",
    titleExists: "Lead source title already exists",
    defaultNotExists: "Default lead source does not exist",
    assignedOnLead: "Lead source is assigned on lead",
    cannotDeleteDefaultLeadSource: "Default lead source cannot be deleted",
  },
  leadStatus: {
    notFound: "Lead status not found",
    titleExists: "Lead status title already exists",
    defaultNotExists: "Default lead status does not exist",
    assignedOnLead: "Lead status is assigned on lead",
    cannotDeleteDefaultLeadStatus: "Default lead status cannot be deleted",
  },
  leadType: {
    notFound: "Lead type not found",
    titleExists: "Lead type title already exists",
    defaultNotExists: "Default lead type does not exist",
    assignedOnLead: "Lead type is assigned on lead",
    cannotDeleteDefaultLeadType: "Default lead type cannot be deleted",
  },
  order: {
    notFound: "Order not found",
  },
  orderStatus: {
    notFound: "Order status not found",
    titleExists: "Order status title already exists",
    defaultNotExists: "Default order status does not exist",
    assignedOnOrder: "Order status is assigned on order",
    cannotDeleteDefaultOrderStatus: "Default order status cannot be deleted",
  },
  outsidePrinting: {
    notFound: "Outside printing not found",
    titleExists: "Outside printing title already exists",
    assignedOnBoxSpecification:
      "Outside printing is assigned on box specification",
  },
  role: {
    notFound: "Role not found",
    titleExists: "Role title already exists",
    assignedOnUser: "Role is assigned on user",
  },
  stamping: {
    notFound: "Stamping not found",
    titleExists: "Stamping title already exists",
    assignedOnBoxSpecification: "Stamping is assigned on box specification",
  },
  stock: {
    notFound: "Stock not found",
    titleExists: "Stock title already exists",
    assignedOnBoxSpecification: "Stock is assigned on box specification",
  },
  task: {
    notFound: "Task not found",
  },
  taskStatus: {
    notFound: "Task status not found",
    titleExists: "Task status title already exists",
    defaultNotExists: "Default task status does not exist",
    assignedOnTask: "Task status is assigned on task",
    cannotDeleteDefaultTaskStatus: "Default task status cannot be deleted",
  },
  taskPriority: {
    notFound: "Task priority not found",
    titleExists: "Task priority title already exists",
    defaultNotExists: "Default task priority does not exist",
    assignedOnTask: "Task status is assigned on task",
    cannotDeleteDefaultTaskPriority: "Default task priority cannot be deleted",
  },
  user: {
    notFound: "User not found",
    notFoundInBrand: "User not found in brand",
    emailExists: "User email already exists",
    brandsAndBrandAliasesNotMatch: "Brands and brand aliases should be same",
  },
  notification: {
    notFound: "Notification not found",
    bulkNotFound: "One or more notification(s) not found",
  },
};
