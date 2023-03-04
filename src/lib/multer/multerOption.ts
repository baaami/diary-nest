// 업로드 가능한 확장자 설정
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

// 파일명 중복을 피하기 위해 파일명 수정
export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split(".")[0];
  const fileExtName = file.originalname.slice(
    file.originalname.lastIndexOf(".") - 1 + 2
  );
  const time = Date.now();
  const randomName = `${name}-${time}`;
  callback(null, `${randomName}.${fileExtName}`);
};
