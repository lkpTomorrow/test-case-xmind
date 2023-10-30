<template lang="">
<div class="expand-group">

  <el-button class="el-icon-s-flag"></el-button>
  <el-row class="block-col-1">
    <el-col :span="24">
      <!-- <span class="demonstration">click 激活</span> -->
      <el-dropdown 
        trigger="click" 
        :hide-on-click="true" 
        class="dropdown-toggle menu-btn" 
        @command="handleCommand"
        :disabled="commandDisabled"
        >
        <span class="el-dropdown-link ">
          旗子
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="expand-dropdown-list">
          <el-dropdown-item class="expand-1 dropdown-item " command="0">无</el-dropdown-item>
          <el-dropdown-item class="expand-1 dropdown-item " command="1">
            <img src="./icon/flag-red.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-2 dropdown-item " command="2">
            <img src="./icon/flag-orange.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-3 dropdown-item " command="3">
            <img src="./icon/flag-yellow.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-4 dropdown-item " command="4">
            <img src="./icon/flag-blue.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-5 dropdown-item " command="5">
            <img src="./icon/flag-green.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-6 dropdown-item " command="6">
            <img src="./icon/flag-purple.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
          <el-dropdown-item class="expand-6 dropdown-item " command="7">
            <img src="./icon/flag-gray.png" alt="红色" style="width:18px;height:18px;">
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
export default {
  name: 'expand',
  computed: {
    ...mapGetters('caseEditorStore', {
      'minder': 'getMinder'
    }),
    commandDisabled() {
      var minder = this.minder
      minder.on && minder.on('interactchange', function () {
        this.commandValue = minder.queryCommandValue('priority');
      });
      // console.info(minder)
      return minder.queryCommandState && minder.queryCommandState('priority') === -1;
    },

  },
  methods: {
    handleCommand (index) {
      this.commandDisabled || this.minder.execCommand('flagicon', index)
    },

    expandAll() {
      this.minder.execCommand && minder.execCommand('flag', 9999);
    }
  }
}
</script>
