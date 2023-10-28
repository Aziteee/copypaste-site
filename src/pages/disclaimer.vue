<template>
  <div class="content">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold;">公告</span>
        </div>
      </template>
      <el-text>
        网站界面重写中...有什么想法或者有bug可以都在github提issue
      </el-text>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold;">更新说明</span>
        </div>
      </template>
      <el-text>
        2023-10-27更新：<br>
        1.搜索功能升级<br>
        2.搜索界面更新<br>
        <br>
        2023-8-31更新：<br>
        1.修复搜索页面页码显示错误的bug<br>
        <br>
        2023-8-29更新：<br>
        1.新增搜索语句进行精确搜索。如搜索“uploader:Azite likes:>0 uploadTime:>=2023-8-26”<br>
        2.网站logo改版<br>
        <br>
        2023-8-27更新：<br>
        1.支持查看某个上传者上传的所有语句<br>
        2.网站采用了gzip压缩，打开速度预计比之前快20%<br>
      </el-text>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold;">免责声明</span>
        </div>
      </template>
      <el-text>
        1、本网站所载的文/图等稿件均出于为公众传播有益资讯信息之目的，并不意味着赞同其观点或证实其内容的真实性，我们不对其科学性、严肃性等作任何形式的保证。<br>
        2、本网站所提供的信息，只供参考之用。本网站不保证信息的准确性、有效性、及时性和完整性。本网站及其雇员一概毋须以任何方式就任何信息传递或传送的失误、不准确或错误，对用户或任何其他人士负任何直接或间接责任。<br>
        3、在法律允许的范围内，本网站在此声明，不承担用户因使用本网站而产生的任何直接、间接、附带或衍生的责任，包括但不限于利润损失或者商业损失的赔偿，即使本网站已经被告知该等损失可能发生。
      </el-text>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold;">联系我</span>
        </div>
      </template>
      <el-text>
        站长邮箱：mail@azite.cn
      </el-text>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.content {
  margin: 0px 9vw;
  display: flex;
  flex-direction: column;
  gap: 20px;

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
