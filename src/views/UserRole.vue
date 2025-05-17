<template>
  <div class="user-role-container">
    <div class="header">
      <h2>用户角色管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索角色名称"
          class="search-input"
          clearable
          @clear="loadUserRoles"
          @keyup.enter="searchUserRoles"
        >
          <template #append>
            <el-button @click="searchUserRoles">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>
    </div>

    <el-table
      :data="userRoles"
      stripe
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="roleDesc" label="角色描述" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isEnabled ? 'success' : 'danger'">
            {{ row.isEnabled ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.isEnabled ? 'danger' : 'success'"
            @click="toggleStatus(row)"
          >
            {{ row.isEnabled ? '禁用' : '启用' }}
          </el-button>
          <el-popconfirm
            title="确定删除该角色吗？"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="form.roleDesc"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-switch
            v-model="form.isEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import service from '@/utils/request'

export default {
  name: 'UserRole',
  components: {
    Search
  },
  setup() {
    const userRoles = ref([])
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('add') // 'add' or 'edit'
    const formRef = ref(null)
    const searchQuery = ref('')

    const form = reactive({
      id: null,
      name: '',
      roleDesc: '',
      isEnabled: true
    })

    const rules = {
      name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符之间', trigger: 'blur' }
      ],
      roleDesc: [
        { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
      ]
    }

    // 加载用户角色列表
    const loadUserRoles = async () => {
      loading.value = true;
      userRoles.value = []; // 清空现有数据
      
      try {
        const response = await service.get('/user-roles');
        userRoles.value = response.data;
      } catch (error) {
        console.error('获取用户角色列表错误:', error);
        ElMessage.error('加载用户角色失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    }

    // 搜索用户角色
    const searchUserRoles = async () => {
      try {
        const response = await service.get(`/user-roles/search`, { 
          params: { name: searchQuery.value } 
        });
        userRoles.value = response.data;
      } catch (error) {
        console.error('搜索用户角色失败:', error);
        ElMessage.error('搜索用户角色失败');
      }
    }

    // 新增用户角色
    const handleAdd = () => {
      dialogType.value = 'add'
      form.id = null
      form.name = ''
      form.roleDesc = ''
      form.isEnabled = true
      dialogVisible.value = true
    }

    // 编辑用户角色
    const handleEdit = (row) => {
      dialogType.value = 'edit'
      form.id = row.id
      form.name = row.name
      form.roleDesc = row.roleDesc
      form.isEnabled = row.isEnabled
      dialogVisible.value = true
    }

    // 切换状态（启用/禁用）
    const toggleStatus = async (row) => {
      try {
        await service.patch(`/user-roles/${row.id}/status`, null, {
          params: { isEnabled: !row.isEnabled }
        });
        ElMessage.success(`用户角色已${!row.isEnabled ? '启用' : '禁用'}`);
        loadUserRoles();
      } catch (error) {
        console.error('切换用户角色状态失败:', error);
        ElMessage.error('切换用户角色状态失败');
      }
    }

    // 删除用户角色
    const handleDelete = async (id) => {
      try {
        await service.delete(`/user-roles/${id}`);
        ElMessage.success('用户角色已删除');
        loadUserRoles();
      } catch (error) {
        console.error('删除用户角色失败:', error);
        ElMessage.error('删除用户角色失败');
      }
    }

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 创建表单数据副本，避免直接修改响应式对象
            const formData = {
              id: form.id,
              name: form.name,
              roleDesc: form.roleDesc,
              isEnabled: form.isEnabled
            };
            
            // 确保日期字段不为空，如果是编辑则后端会使用已有时间，如果是新增则后端会自动设置
            if (!formData.createTime) {
              // 创建时间由后端自动设置，前端不需要处理
              delete formData.createTime;
            }
            
            if (dialogType.value === 'add') {
              await service.post('/user-roles', formData);
              ElMessage.success('用户角色创建成功');
            } else {
              await service.put(`/user-roles/${formData.id}`, formData);
              ElMessage.success('用户角色更新成功');
            }
            
            dialogVisible.value = false;
            loadUserRoles();
          } catch (error) {
            console.error('提交表单错误:', error);
            
            // 显示具体的错误信息
            let errorMsg = `${dialogType.value === 'add' ? '创建' : '更新'}用户角色失败`;
            if (error.response && error.response.data && error.response.data.message) {
              errorMsg += ': ' + error.response.data.message;
            }
            ElMessage.error(errorMsg);
          }
        }
      })
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    onMounted(() => {
      loadUserRoles()
    })

    return {
      userRoles,
      loading,
      dialogVisible,
      dialogType,
      formRef,
      form,
      rules,
      searchQuery,
      handleAdd,
      handleEdit,
      handleDelete,
      toggleStatus,
      submitForm,
      loadUserRoles,
      searchUserRoles,
      formatDate
    }
  }
}
</script>

<style scoped>
.user-role-container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 250px;
}
</style> 