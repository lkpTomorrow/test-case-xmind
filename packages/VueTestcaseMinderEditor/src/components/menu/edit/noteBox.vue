<template>
  <div class="selection-group">
    <i class="el-icon-document" style="font-size: 23px;cursor: pointer;" @click="addNote"></i>
    <el-dropdown trigger="click" @command="handleNoteCommand">
  <span class="el-dropdown-link">
    备注<i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
      <el-dropdown-menu slot="dropdown" class="selection-dropdown-list">
        <el-dropdown-item command="add">插入备注</el-dropdown-item>
        <el-dropdown-item command="remove">移除已有备注</el-dropdown-item>
        <el-dropdown-item command="addPizhu">插入标注</el-dropdown-item>
        <el-dropdown-item command="removePizhu">移除已有的标注</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>


    <el-dialog :title="editType" :visible.sync="noteShow" width="50%">

      <el-input
        v-model="note"
        type="textarea"
        :rows="10"
        placeholder="请输入内容(可用markdown)"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex';


  export default {
    name: "nodeBox",
    data() {
      return {
        noteShow: false,
        note: '',
        editType:''
      }
    },
    computed: {
      ...mapGetters('caseEditorStore', {
        count: 'count',
        'minder': 'getMinder',
      }),
    },
    methods: {
      handleNoteCommand(command) {
        switch (command) {
          case 'add':
            this.addNote();
            break;
          case 'remove':
            this.removeNote();
            break;
          case 'addPizhu':
            this.addPizhu();
            break;
          case 'removePizhu':
            this.removeNote11();
            break;
          default:
            break;
        }
      },
      addNote(){
        this.noteShow = true;
        this.editType='备注'
        this.note = this.minder.queryCommandValue('note');
      },
      removeNote() {
        this.minder.execCommand('note', null);
      },
      removeNote11(){
       this.minder.execCommand('textspan', null);
      },
      //新增批注
      addPizhu(){
        this.noteShow = true;
        this.note = this.minder.queryCommandValue('textspan');
        this.editType=this.note ?'编辑批注 ':'批注'
      },
      //移除批注
      handleSubmit() {
        console.log(this.editType,'fffffffffff')
        if(this.editType!=='备注'){
          console.log('------------nf')
        this.minder.execCommand('textspan', this.note);
        this.note = '';
        this.noteShow = false;
        }else{
        this.minder.execCommand('note', this.note);
        this.note = '';
        this.noteShow = false;
        }


      },
      handleCancel() {
        // 重置填写内容
        this.note='';
        this.noteShow = false;
      },

    }
  }
</script>

<style scoped>
</style>
