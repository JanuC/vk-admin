<template>
  <div v-if="userDialogData.isShow">
    <el-dialog :model-value="userDialogData.isShow" :close-on-click-modal="false" @close="handleClose(userFormRef)">
      <template #header>
        <Title :title="computedTitle(userDialogData.type)" />
      </template>
      <el-descriptions v-if="userDialogData.type === 'detail' && userDetail" v-cLoading="loadingStore.isLoading && userDialogData.isShow" :column="2" border>
        <el-descriptions-item label="用户id:" label-class-name="w-[10rem]" :span="2">{{ userDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名:" label-class-name="w-[10rem]" :span="1">{{ userDetail.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称:" label-class-name="w-[10rem]" :span="1">{{ userDetail.nickName }}</el-descriptions-item>
        <el-descriptions-item label="电话:" label-class-name="w-[10rem]" :span="1">{{ userDetail.phone ? userDetail.phone : '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱:" label-class-name="w-[10rem]" :span="1">{{ userDetail.email ? userDetail.email : '-' }}</el-descriptions-item>
        <el-descriptions-item label="省市:" :span="1">{{ userDetail.area ? userDetail.area.join('') : '-' }}</el-descriptions-item>
        <el-descriptions-item label="详细地址:" :span="1">{{ userDetail.address ? userDetail.address : '-' }}</el-descriptions-item>
        <el-descriptions-item label="头像:" label-class-name="w-[10rem]" :span="1">
          <el-avatar :src="userDetail.avatar" :size="20" shape="square"></el-avatar>
        </el-descriptions-item>

        <el-descriptions-item label="预设用户:" label-class-name="w-[10rem]" :span="1">
          <el-tag :type="userDetail.isDefault ? 'success' : 'danger'">{{ userDetail.isDefault ? '是' : '否' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态:">
          <el-tag :type="userDetail.isEnable ? 'success' : 'danger'">{{ userDetail.isEnable ? '启用' : '禁用' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户角色:" :span="3">
          <el-space>
            <el-tag type="primary" v-for="item in userDetail.roles" :key="item.id">{{ item.name }}</el-tag>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间:" :span="3">
          {{ formatDate(userDetail.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间:" :span="3">
          {{ formatDate(userDetail.updateTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form v-else :model="userForm" class="mt-[1rem]" label-width="auto" :rules="userFormRules" ref="userFormRef" v-cLoading="loadingStore.isLoading && userDialogData.isShow">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="基础表单" name="basic">
            <template #title>
              <el-tooltip content="新用户基础信息">基础表单</el-tooltip>
            </template>

            <el-row justify="space-around">
              <el-col :span="10">
                <el-form-item label="用户名:" prop="username">
                  <el-input placeholder="请输入用户名" clearable v-model="userForm.username" :disabled="userDialogData.type === 'edit'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="昵称:" prop="nickName">
                  <el-input placeholder="请输入用户昵称" clearable v-model="userForm.nickName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row justify="space-around" v-if="userDialogData.type === 'create'">
              <el-col :span="10">
                <el-form-item label="密码:" prop="password">
                  <el-input placeholder="请输入用户密码" v-model="userForm.password" clearable show-password type="password" autocomplete="new-password"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="确认密码:" prop="confirmPassword">
                  <el-input placeholder="请再次输入密码" type="password" clearable show-password v-model="userForm.confirmPassword"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row justify="space-around">
              <el-col :span="10">
                <el-form-item label="手机:" prop="phone">
                  <el-input placeholder="请输入手机号码" clearable v-model="userForm.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="邮箱:" prop="email">
                  <el-input placeholder="请输入用户邮箱" v-model="userForm.email" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row justify="space-around">
              <el-col :span="10">
                <el-form-item label="省市区:" prop="area">
                  <el-cascader class="w-full" clearable placeholder="请选择省市区" v-model="userForm.area" :options="pcaTextArr"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="详细地址:" prop="address">
                  <el-input clearable placeholder="请输入详细地址" v-model="userForm.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row justify="space-around">
              <el-col :span="10">
                <el-form-item label="用户头像:" prop="avatar">
                  <!-- <el-space class="w-full !flex"> -->
                  <el-row class="w-full" justify="space-between">
                    <el-col :span="8">
                      <el-image class="w-[10rem] h-[10rem]" :src="userForm.avatar" fit="cover">
                        <template #error>
                          <div class="image-slot w-full h-full flex justify-around items-center bg-[var(--el-fill-color-light)]">
                            <i-ep-picture />
                          </div>
                        </template>
                      </el-image>
                    </el-col>
                    <el-col :span="14">
                      <UploadImage @getImageUrl="handleGetImageUrl" />
                    </el-col>
                  </el-row>

                  <!-- </el-space> -->
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="启用:" prop="isEnable">
                  <el-radio-group v-model="userForm.isEnable" :disabled="userDialogData.type === 'edit' && Boolean(userForm.isDefault)">
                    <el-radio :value="0">禁用</el-radio>
                    <el-radio :value="1">启用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="用户角色" name="role">
            <template #title>
              <el-tooltip content="为新用户分配角色">用户角色</el-tooltip>
            </template>
            <el-form-item prop="roles">
              <el-checkbox-group v-model="userForm.roleIds" :disabled="Boolean(userForm.isDefault)">
                <el-checkbox v-for="item in allRoles" :key="item.id" :label="item.name" :value="item.id" :disabled="Boolean(item.isCommon)" />
              </el-checkbox-group>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <template #footer>
        <el-space v-if="userDialogData.type === 'detail'">
          <el-button @click="handleClose(userFormRef)">关闭</el-button>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </el-space>
        <el-space v-else>
          <el-button @click="handleClose(userFormRef)">取消</el-button>
          <el-button type="primary" @click="handleConifrm(userFormRef)">确认</el-button>
        </el-space>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="User-Dialog">
import { ModelRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { getAllRoles } from '@/http/api/role'
import { getUserById, createUser, updateUserById } from '@/http/api/user'
import { noticeSuccess } from '@/utils/Notification/index'
import { pcaTextArr } from 'element-china-area-data'
import { useStore } from '@/store/index'
import { formatDate } from '@/utils/formatDate'
import { encryptString } from '@/utils/md5'

const userDialogData = defineModel<UserDialogProps>('userDialogData') as ModelRef<UserDialogProps>

const emits = defineEmits(['getNewData'])

const { loadingStore } = useStore()

// 默认展开的面板
const activeCollapse = ref<string[]>(['basic', 'role'])

// 用户信息
const userForm = reactive<dialogUserFormProps>({
  username: '',
  password: '',
  confirmPassword: '',
  nickName: '',
  isEnable: 0,
  isDefault: 0,
  email: '',
  phone: '',
  avatar: '',
  area: null,
  address: '',
  roleIds: [],
})

const userFormRef = ref<FormInstance>()

const userFormRules = reactive<FormRules<dialogUserFormProps>>({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: ['blur', 'change'],
    },
    {
      pattern: /^[A-Za-z0-9-_]+$/,
      message: '用户名只能为英文、数字或者下划线',
      trigger: ['blur', 'change'],
    },
    {
      min: 4,
      max: 10,
      message: '用户名长度必须为4-10位',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value.length < 6 || value.length > 16) {
          callback(new Error('密码长度必须为6-16之间'))
        } else if (userForm.confirmPassword !== '') {
          userFormRef.value?.validateField('confirmPassword', () => {})
        }
        callback()
      },
      trigger: 'change',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: 'blur',
    },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== userForm.password) {
          callback(new Error('两次输出的密码不一致'))
        }
        callback()
      },
      trigger: 'change',
    },
  ],
  phone: [
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '手机号码格式不正确',
      trigger: ['blur', 'change'],
    },
  ],
  email: [
    {
      pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '邮箱格式不正确',
      trigger: ['blur', 'change'],
    },
  ],
})

const allRoles = ref<RoleProps[]>([])

// 根据不同的 type 计算不同的 title
const computedTitle = computed(() => (type: string) => {
  if (type == 'create') return '新建用户'
  if (type == 'edit') return '编辑用户'
  return '用户详情'
})

// 编辑按钮
const handleEdit = () => {
  userDialogData.value.type = 'edit'
  userDialogData.value.id = userDetail.value!.id
  getTargetUser(userDetail.value!.id)
}

// 关闭 dialog
const handleClose = (formEl: FormInstance | undefined) => {
  if (userDialogData.value.type !== 'detail') {
    if (!formEl) return
    formEl.resetFields()
  }
  userDialogData.value.id = ''
  userDialogData.value.isShow = false
}

// 获取所有角色
const getAllRolesList = async () => {
  const { data } = await getAllRoles()
  allRoles.value = data
  // 将预设角色默认选中
  data.forEach((role: RoleProps) => {
    if (role.isCommon) userForm.roleIds.push(role.id)
  })
}

// 点击确认按钮
const handleConifrm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) createOrUpdateUser()
  })
}

// 获取目标用户信息
const userDetail = ref<UserProps>()
const getTargetUser = async (id: string) => {
  const { data } = await getUserById(id)

  userDetail.value = data
  const { username, nickName, phone, email, area, address, avatar, isEnable, isDefault, roleIds } = data

  userForm.username = username
  userForm.nickName = nickName
  userForm.phone = phone
  userForm.email = email
  userForm.isDefault = isDefault
  userForm.area = area
  userForm.avatar = avatar
  userForm.isEnable = isEnable
  userForm.roleIds = roleIds
  userForm.address = address ? address : ''
}

// 创建或者更新用户
const createOrUpdateUser = async () => {
  const { username, nickName, password, avatar, email, phone, isEnable, roleIds, area, address } = userForm

  if (userDialogData.value.id) {
    // 更新用户
    const { id } = userDialogData.value
    await updateUserById(id, {
      username,
      nickName,
      avatar,
      email,
      phone,
      isEnable,
      roleIds,
      area,
      address,
    })

    noticeSuccess('更新用户成功')
  } else {
    // 创建用户
    await createUser({
      username,
      password: encryptString(password),
      avatar,
      email,
      phone,
      isEnable,
      roleIds,
      area,
      address,
    })
    noticeSuccess('创建用户成功')
  }
  emits('getNewData')
  handleClose(userFormRef.value)
}

const handleGetImageUrl = (imageUrl: string) => {
  userForm.avatar = imageUrl
}

watch(
  () => [userDialogData.value.isShow, userDialogData.value.id, userDialogData.value.type],
  ([newShow, newId, newType]) => {
    if (newShow) {
      loadingStore.setIsLoading(true)
      if (newType !== 'detail') {
        getAllRolesList()
      }
      if (newId) getTargetUser(newId as string)
      loadingStore.setIsLoading(false)
    }
  }
)
</script>

<style lang="scss" scoped>
.image-slot {
  font-size: 30px;
}
</style>
