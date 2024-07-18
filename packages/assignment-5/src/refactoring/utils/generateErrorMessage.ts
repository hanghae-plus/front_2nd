const generateErrorMessage = {
  formError: (valueName: string, condition?: string) => {
    return `${valueName}: ${
      condition ? `${condition} ` : ""
    }값을 입력해주세요.`;
  },
};

export default generateErrorMessage;
