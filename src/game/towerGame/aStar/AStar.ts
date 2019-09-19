interface IMapTileModel
{
	/**
	 * 是否为障碍
	 * @param p_startX	始点X坐标
	 * @param p_startY	始点Y坐标
	 * @param p_endX	终点X坐标
	 * @param p_endY	终点Y坐标
	 * @return			0为障碍 1为通路
	 */
		isBlock(p_startX : number, p_startY : number, p_endX : number, p_endY : number) : number;

}
/**
	 *
	 * A* 寻路算法 
	 * @author Celine
	 * 
	 */
	class AStar
	{
		//====================================
		//	Constants
		//====================================

		private  COST_STRAIGHT : number = 10;
		private  COST_DIAGONAL : number = 10000;


//	//横或竖向移动一格的路径评分
//		private  COST_STRAIGHT : number = 10;
////		//斜向移动一格的路径评分
//		private  COST_DIAGONAL : number = 14;
		
		//(单个)节点数组 节点ID 索引
		private  NOTE_ID : number = 0;
		//(单个)节点数组 是否在开启列表中 索引
		private  NOTE_OPEN : number = 1;
		//(单个)节点数组 是否在关闭列表中 索引
		private  NOTE_CLOSED : number = 2;
		//====================================
		//	Member Variables
		//====================================
		//地图模型
		protected m_mapTileModel : IMapTileModel;
		//最大寻路步数，限制超时返回
		private m_maxTry : number;
		
		//开放列表，存放节点ID
		private m_openList : Array<any>;
		//开放列表长度
		private m_openCount : number;
		//节点加入开放列表时分配的唯一ID(从0开始)
		//根据此ID(从下面的列表中)存取节点数据
		private m_openId : number;
		
		//节点x坐标列表
		private m_xList : Array<any>;
		//节点y坐标列表
		private m_yList : Array<any>;
		//节点路径评分列表
		private m_pathScoreList : Array<any>;
		//(从起点移动到)节点的移动耗费列表
		private m_movementCostList : Array<any>;
		//节点的父节点(ID)列表
		private m_fatherList : Array<any>;
		
		//节点(数组)地图,根据节点坐标记录节点开启关闭状态和ID
		private m_noteMap : Array<any>;
		//====================================
		//	Constructor
		//====================================
		/**
		 * Constructor
		 * 
		 * @param p_mapTileModel	地图模型，实现 IMapTileModel 接口
		 * @param p_maxTry			最大寻路步数，限制超时返回
		 */
		public constructor(p_mapTileModel : IMapTileModel, p_maxTry : number = 10000)
		{
			this.m_mapTileModel = p_mapTileModel;
			this.m_maxTry = p_maxTry;
		}
		//====================================
		//	Properties
		//====================================
		/**
		 * 最大寻路步数，限制超时返回
		 */		
		public  get maxTry() : number
		{
			return this.m_maxTry;
		}
		/**
		 * @private
		 */		
		public  set maxTry(p_value : number)
		{
			this.m_maxTry = p_value;
		}
		
		//====================================
		//	Public Methods
		//====================================
		/**
		 * 开始寻路
		 * 
		 * @param p_startX		起点X坐标
		 * @param p_startY		起点Y坐标
		 * @param p_endX		终点X坐标
		 * @param p_endY		终点Y坐标
		 * 
		 * @return 				找到的路径(二维数组 : [p_startX, p_startY], ... , [p_endX, p_endY])
		 */		
		public  find(p_startX : number, p_startY : number, p_endX : number, p_endY : number) : Array<any>
		{
			this.initLists();
			this.m_openCount = 0;
			this.m_openId = -1;
			
			this.openNote(p_startX, p_startY, 0, 0, 0);
			
			var currTry : number = 0;
			var currId : number;
			var currNoteX : number;
			var currNoteY : number;
			var aroundNotes : Array<any>;
			
			var checkingId : number;
			
			var cost : number;
			var score : number;
			while (this.m_openCount > 0)
			{
				//超时返回
				if (++currTry > this.m_maxTry)
				{
					this.destroyLists();
					return null;
				}
				//每次取出开放列表最前面的ID
				currId = this.m_openList[0];
				//将编码为此ID的元素列入关闭列表
				this.closeNote(currId);
				currNoteX = this.m_xList[currId];
				currNoteY = this.m_yList[currId];
				
				//如果终点被放入关闭列表寻路结束，返回路径
				if (currNoteX == p_endX && currNoteY == p_endY)
				{
					return this.getPath(p_startX, p_startY, currId);
				}
				//获取周围节点，排除不可通过和已在关闭列表中的
				aroundNotes = this.getArounds(currNoteX, currNoteY);
				//对于周围的每一个节点
				for (var s  in aroundNotes)
				{
					var note = aroundNotes[s];
					//计算F和G值
					cost = this.m_movementCostList[currId] + ((note[0] == currNoteX || note[1] == currNoteY) ? this.COST_STRAIGHT : this.COST_DIAGONAL);
					score = cost + (Math.abs(p_endX - note[0]) + Math.abs(p_endY - note[1])) * this.COST_STRAIGHT;
					if (this.isOpen(note[0], note[1])) //如果节点已在播放列表中
					{
						checkingId = this.m_noteMap[note[1]][note[0]][this.NOTE_ID];
						//如果新的G值比节点原来的G值小,修改F,G值，换父节点
						if(cost < this.m_movementCostList[checkingId])
						{
							this.m_movementCostList[checkingId] = cost;
							this.m_pathScoreList[checkingId] = score;
							this.m_fatherList[checkingId] = currId;
							this.aheadNote(this.getIndex(checkingId));
						}
					} else //如果节点不在开放列表中
					{
						//将节点放入开放列表
						this.openNote(note[0], note[1], score, cost, currId);
					}
				}
			}
			//开放列表已空，找不到路径
			this.destroyLists();
			return null;
		}
		//====================================
		//	Private Methods
		//====================================
		/**
		 * @private
		 * 将节点加入开放列表
		 * 
		 * @param p_x		节点在地图中的x坐标
		 * @param p_y		节点在地图中的y坐标
		 * @param P_score	节点的路径评分
		 * @param p_cost	起始点到节点的移动成本
		 * @param p_fatherId	父节点
		 */
		private  openNote(p_x : number, p_y : number, p_score : number, p_cost : number, p_fatherId : number) : void
		{
			this.m_openCount++;
			this.m_openId++;
			
			if (this.m_noteMap[p_y] == null)
			{
				this.m_noteMap[p_y] = [];
			}
			this.m_noteMap[p_y][p_x] = [];
			this.m_noteMap[p_y][p_x][this.NOTE_OPEN] = true;
			this.m_noteMap[p_y][p_x][this.NOTE_ID] = this.m_openId;
			
			this.m_xList.push(p_x);
			this.m_yList.push(p_y);
			this.m_pathScoreList.push(p_score);
			this.m_movementCostList.push(p_cost);
			this.m_fatherList.push(p_fatherId);
			
			this.m_openList.push(this.m_openId);
			this.aheadNote(this.m_openCount);
		}
		/**
		 * @private
		 * 将节点加入关闭列表
		 */
		private  closeNote(p_id: number) : void
		{
			this.m_openCount--;
			var noteX : number = this.m_xList[p_id];
			var noteY : number = this.m_yList[p_id];
			this.m_noteMap[noteY][noteX][this.NOTE_OPEN] = false;
			this.m_noteMap[noteY][noteX][this.NOTE_CLOSED] = true;
			
			if (this.m_openCount <= 0)
			{
				this.m_openCount = 0;
				this.m_openList = [];
				return;
			}
			this.m_openList[0] = this.m_openList.pop();
			this.backNote();
		}
		/**
		 * @private
		 * 将(新加入开放别表或修改了路径评分的)节点向前移动
		 */
		private  aheadNote(p_index : number) : void
		{
			var father : number;
			var change : number;
			while(p_index > 1)
			{
				//父节点的位置
				father = Math.floor(p_index / 2);
				//如果该节点的F值小于父节点的F值则和父节点交换
				if (this.getScore(p_index) < this.getScore(father))
				{
					change = this.m_openList[p_index - 1];
					this.m_openList[p_index - 1] = this.m_openList[father - 1];
					this.m_openList[father - 1] = change;
					p_index = father;
				} else
				{
					break;
				}
			}
		}
		/**
		 * @private
		 * 将(取出开启列表中路径评分最低的节点后从队尾移到最前的)节点向后移动
		 */
		private  backNote() : void
		{
			//尾部的节点被移到最前面
			var checkIndex : number = 1;
			var tmp : number;
			var change : number;
			
			while(true)
			{
				tmp = checkIndex;
				//如果有子节点
				if (2 * tmp <= this.m_openCount)
				{
					//如果子节点的F值更小
					if(this.getScore(checkIndex) > this.getScore(2 * tmp))
					{
						//记节点的新位置为子节点位置
						checkIndex = 2 * tmp;
					}
					//如果有两个子节点
					if (2 * tmp + 1 <= this.m_openCount)
					{
						//如果第二个子节点F值更小
						if(this.getScore(checkIndex) > this.getScore(2 * tmp + 1))
						{
							//更新节点新位置为第二个子节点位置
							checkIndex = 2 * tmp + 1;
						}
					}
				}
				//如果节点位置没有更新结束排序
				if (tmp == checkIndex)
				{
					break;
				} 
					//反之和新位置交换，继续和新位置的子节点比较F值
				else
				{
					change = this.m_openList[tmp - 1];
					this.m_openList[tmp - 1] = this.m_openList[checkIndex - 1];
					this.m_openList[checkIndex - 1] = change;
				}
			}
		}
		/**
		 * @private
		 * 判断某节点是否在开放列表
		 */		
		private  isOpen(p_x : number, p_y : number) : Boolean
		{
			if (this.m_noteMap[p_y] == null) return false;
			if (this.m_noteMap[p_y][p_x] == null) return false;
			return this.m_noteMap[p_y][p_x][this.NOTE_OPEN];
		}
		/**
		 * @private
		 * 判断某节点是否在关闭列表中
		 */		
		private  isClosed(p_x : number, p_y : number) : Boolean
		{
			if (this.m_noteMap[p_y] == null) return false;
			if (this.m_noteMap[p_y][p_x] == null) return false;
			return this.m_noteMap[p_y][p_x][this.NOTE_CLOSED];
		}
		/**
		 * @private
		 * 获取某节点的周围节点，排除不能通过和已在关闭列表中的
		 */		
		private  getArounds(p_x : number, p_y : number) : Array<any>
		{
			var arr : Array<any> = [];
			var checkX : number;
			var checkY : number;
			var canDiagonal : Boolean;
			/*
			var canRight : Boolean = true;
			var canLeft : Boolean = true;
			var canDown : Boolean = true;
			var canUp : Boolean = true;
			*/
			//右
			checkX = p_x + 1;
			checkY = p_y;
			var canRight : Boolean = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canRight && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//下
			checkX = p_x;
			checkY = p_y + 1;
			var canDown : Boolean = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canDown && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			
			//左
			checkX = p_x - 1;
			checkY = p_y;
			var canLeft : Boolean = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canLeft && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//上
			checkX = p_x;
			checkY = p_y - 1;
			var canUp : Boolean = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canUp && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//通过倒转起点和终点来计算？
			//右下
			checkX = p_x + 1;
			checkY = p_y + 1;
			canDiagonal = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canDiagonal && canRight && canDown && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//左下
			checkX = p_x - 1;
			checkY = p_y + 1;
			canDiagonal = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canDiagonal && canLeft && canDown && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//左上
			checkX = p_x - 1;
			checkY = p_y - 1;
			canDiagonal = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canDiagonal && canLeft && canUp && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			//右上
			checkX = p_x + 1;
			checkY = p_y - 1;
			canDiagonal = this.m_mapTileModel.isBlock(p_x, p_y, checkX, checkY) == 1;
			if (canDiagonal && canRight && canUp && !this.isClosed(checkX, checkY))
			{
				arr.push([checkX, checkY]);
			}
			
			return arr;
		}
		/**
		 * @private
		 * 获取路径   ////////////////////////////////////////////////////
		 * 
		 * @param p_startX	起始点X坐标
		 * @param p_startY	起始点Y坐标
		 * @param p_id		终点的ID
		 * 
		 * @return 			路径坐标(Point)数组
		 */		
		protected  getPath(p_startX : number, p_startY : number, p_id: number) : Array<any>
		{
			var arr : Array<any> = [];
			var noteX : number = this.m_xList[p_id];
			var noteY : number = this.m_yList[p_id];
			while (noteX != p_startX || noteY != p_startY)
			{
				arr.unshift([noteX, noteY]);
				p_id = this.m_fatherList[p_id];
				noteX = this.m_xList[p_id];
				noteY = this.m_yList[p_id];
			}
			arr.unshift([p_startX, p_startY]);
			this.destroyLists();
			return arr;
		}
		/**
		 * @private
		 * 获取某ID节点在开放列表中的索引(从1开始)
		 */		
		private  getIndex(p_id : number) : number
		{
			var i : number = 1;
			for(var s in this.m_openList)
			{
				var id = this.m_openList[s];
				if (id == p_id)
				{
					return i;
				}
				i++;
			}
			return -1;
		}
		/**
		 * @private
		 * 获取某节点的路径评分
		 * 
		 * @param p_index	节点在开启列表中的索引(从1开始)
		 */		
		private  getScore(p_index : number) : number
		{
			return this.m_pathScoreList[this.m_openList[p_index - 1]];
		}
		/**
		 * @private
		 * 初始化数组
		 */		
		private  initLists() : void
		{
			this.m_openList = [];
			this.m_xList = [];
			this.m_yList = [];
			this.m_pathScoreList = [];
			this.m_movementCostList = [];
			this.m_fatherList = [];
			this.m_noteMap = [];
		}
		/**
		 * @private
		 * 销毁数组
		 */
		private  destroyLists() : void
		{
			this.m_openList = null;
			this.m_xList = null;
			this.m_yList = null;
			this.m_pathScoreList = null;
			this.m_movementCostList = null;
			this.m_fatherList = null;
			this.m_noteMap = null;
		}
}