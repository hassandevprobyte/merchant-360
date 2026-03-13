exports.executeController = async (Controller, request) => {
  return new Promise((resolve, reject) => {
    const ctrl = new Controller(request.getJSON());

    ctrl.execute(() => {
      const response = ctrl.getResponse();

      if (!response) {
        reject(ctrl.getError());
        return;
      }

      resolve(response);
    });
  });
}
