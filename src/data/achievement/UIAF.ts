interface Info {
  export_app: string; // 导出的app名称
  export_app_version?: string; // 导出此份记录的App版本号
  uiaf_version: string; // 所应用的 UIAF 的版本,包含此字段以防 UIAF 出现中断性变更时，App无法处理
  export_timestamp: number; // 导出UNIX时间戳
}

interface Achievement {
  id: number; // 对应的成就id
  current: number; // 进度
  status: number; // 完成状态: ACHIEVEMENT_INVALID = 0; ACHIEVEMENT_UNFINISHED = 1; ACHIEVEMENT_FINISHED = 2; ACHIEVEMENT_POINT_TAKEN = 3;
  timestamp: number; // 完成的时间
}

interface UIAF {
  info: Info; // 包含导出方定义的基本信息
  list: Achievement[]; // 包含完成或未完成的成就
}

export type { UIAF };
