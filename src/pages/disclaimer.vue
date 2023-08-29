<template>
  <div class="content">
    <el-text tag="h1" size="large">更新说明</el-text>
    <br>
    <el-text>
      2023-8-29更新：<br>
      1.新增搜索语句，可使用uploader、likes、uploaderTime命令进行精确搜索。比如在搜索框搜索“uploader:Azite likes:>0 uploadTime:>=2023-8-26”就是查询上传者Azite的点赞数大于0且上传时间在26号之后的语句<br>
      <br>
      2023-8-27更新：<br>
      1.支持查看某个上传者上传的所有语句<br>
      2.网站采用了gzip压缩，打开速度预计比之前快20%<br>
    </el-text>
    <br>
    <br>
    <el-text tag="h1" size="large">免责声明</el-text>
    <br>
    <el-text>
      1、本网站所载的文/图等稿件均出于为公众传播有益资讯信息之目的，并不意味着赞同其观点或证实其内容的真实性，我们不对其科学性、严肃性等作任何形式的保证。<br>
      2、本网站所提供的信息，只供参考之用。本网站不保证信息的准确性、有效性、及时性和完整性。本网站及其雇员一概毋须以任何方式就任何信息传递或传送的失误、不准确或错误，对用户或任何其他人士负任何直接或间接责任。<br>
      3、在法律允许的范围内，本网站在此声明，不承担用户因使用本网站而产生的任何直接、间接、附带或衍生的责任，包括但不限于利润损失或者商业损失的赔偿，即使本网站已经被告知该等损失可能发生。
    </el-text>
  </div>
</template>

<style scoped lang="scss">
.content {
  margin: 0px 10vw;

  @media screen {
    @media (max-width: 768px) {
      margin: 0px 5vw;
    }

    @media (max-width: 480px) {
      margin: 0px 5px;
    }
  }
}
</style>
