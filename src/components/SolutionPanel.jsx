import React, { useState, useRef, useEffect } from 'react'
import { Send, Users, Bot, FileText, Lightbulb, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import AnimatedTransition from './AnimatedTransition'

const SolutionPanel = ({ 
  scenario, 
  messages, 
  onSendMessage, 
  isProcessing,
  iterationProcessing, // 新增：迭代处理状态
  iterationMode,
  pendingResponse,
  onGenerateSuggestion,
  onGenerateFollowUp,
  onConfirmSend,
  onCancelIteration
}) => {
  const [input, setInput] = useState('')
  const [finalResponse, setFinalResponse] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 当进入迭代模式时，将待发送的响应填入输入框
  useEffect(() => {
    if (iterationMode && pendingResponse) {
      setFinalResponse(pendingResponse)
    }
  }, [iterationMode, pendingResponse])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    onSendMessage({
      text: input.trim(),
      timestamp: new Date().toISOString()
    })

    setInput('')
  }

  const handleConfirmSend = () => {
    if (!finalResponse.trim()) return
    onConfirmSend(finalResponse.trim())
    setFinalResponse('')
  }

  const insertSampleResponse = () => {
    const sampleResponses = {
      retail: '为您推荐三款商务西装：1）海军蓝修身款A123，售价1280元，意大利进口面料，免费修改，适合演讲场合；2）深灰经典款B456，售价1150元，舒适透气，商务首选；3）炭黑现代款C789，售价1350元，时尚剪裁。175cm身高建议选L码，提供3天内修改服务，可预约试穿。',
      enterprise: '推荐开发AI驱动的个性化推荐系统：第一阶段（1个月）用户行为数据收集分析，第二阶段（1.5个月）算法开发测试，第三阶段（0.5个月）部署优化。预计投入3名算法工程师、2名前端开发，总预算45万元，预期提升留存率至48%。',
      education: '波粒二象性可以通过双缝实验理解：当光通过两个缝时表现为波（产生干涉条纹），当我们观测光子通过哪个缝时表现为粒子（条纹消失）。建议做法：1）观看双缝实验视频，2）学习光电效应原理，3）练习相关计算题，4）参加实验课亲自操作。'
    }
    setInput(sampleResponses[scenario.id] || '')
  }

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">解决方案</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{scenario.solutionRole}</p>
            </div>
          </div>
          <button
            onClick={insertSampleResponse}
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            插入示例
          </button>
        </div>
      </div>

      {/* 迭代模式提示 */}
      {iterationMode && (
        <AnimatedTransition type="slide-down" show={true}>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">迭代模式 - 请确认最终回复内容</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              您可以继续编辑内容，确认无误后点击"确认发送"将回复发送给客户
            </p>
          </div>
        </AnimatedTransition>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4">
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
            <AnimatedTransition type="fade" show={true}>
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full shadow-inner">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </AnimatedTransition>
            <p className="text-lg">等待接收LLM翻译的需求</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              在此基础上提供定制化解决方案
            </p>
          </div>
        )}
        
        {messages && messages.map((message, index) => (
          <AnimatedTransition 
            key={index} 
            type={message.type === 'user' ? 'slide-right' : 'slide-left'} 
            show={true}
          >
            <div className="space-y-2">
              {message.type === 'llm_request' && (
                <div className="message-bubble bg-blue-50 text-blue-900 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-2">
                    <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        来自LLM的翻译需求
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message.text}</p>
                      <div className="text-xs text-blue-600 mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="message-bubble bg-green-100 text-green-900 ml-auto shadow-sm hover:shadow-md transition-all duration-200">
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message.text}</p>
                  <div className="text-xs text-green-700 mt-1 opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}
              
              {message.type === 'ai_response' && (
                <div className="message-bubble message-ai shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-2">
                    <Bot className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        LLM优化后的响应
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message.text}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 新增：建议消息 */}
              {message.type === 'suggestion' && (
                <div className="message-bubble bg-purple-50 text-purple-900 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-purple-700 mb-1">
                        AI生成的建议
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message.text}</p>
                      <div className="text-xs text-purple-600 mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 新增：追问消息 */}
              {message.type === 'followup' && (
                <div className="message-bubble bg-orange-50 text-orange-900 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-orange-700 mb-1">
                        AI生成的追问
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message.text}</p>
                      <div className="text-xs text-orange-600 mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimatedTransition>
        ))}
        
        {/* 显示迭代处理状态 */}
        {iterationProcessing && (
          <AnimatedTransition type="fade" show={true}>
            <div className="message-bubble message-ai border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-purple-700 dark:text-purple-300">AI正在生成...</span>
              </div>
            </div>
          </AnimatedTransition>
        )}
        
        {/* 显示常规处理状态 */}
        {isProcessing && !iterationProcessing && (
          <AnimatedTransition type="fade" show={true}>
            <div className="message-bubble message-ai border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-green-700 dark:text-green-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 迭代模式下的操作按钮 */}
      {iterationMode && (
        <AnimatedTransition type="slide-up" show={true}>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">编辑最终回复内容</span>
              </div>
              
              <textarea
                value={finalResponse}
                onChange={(e) => setFinalResponse(e.target.value)}
                placeholder="编辑最终回复内容..."
                className="input-field resize-none transition-all duration-200 focus:shadow-md"
                rows={4}
                disabled={isProcessing}
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={handleConfirmSend}
                  disabled={!finalResponse.trim() || isProcessing}
                  className="flex-1 btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  title="确认发送给客户"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>确认发送</span>
                </button>
                
                <button
                  onClick={onCancelIteration}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  title="取消迭代"
                >
                  <XCircle className="w-4 h-4" />
                  <span>取消</span>
                </button>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      )}

      {/* 常规输入区域 */}
      {!iterationMode && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`作为${scenario.solutionRole}，请提供您的专业建议...`}
                  className="input-field resize-none transition-all duration-200 focus:shadow-md"
                  rows={3}
                  disabled={isProcessing || iterationProcessing}
                />
              </div>
              
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing || iterationProcessing}
                  className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 hover:scale-105"
                  title="发送解决方案"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* 新增：AI辅助按钮 */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onGenerateSuggestion}
                disabled={iterationProcessing || !messages || messages.length === 0}
                className="flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                title="AI生成建议"
              >
                {iterationProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4" />
                    <span>生成相应建议</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onGenerateFollowUp}
                disabled={iterationProcessing || !messages || messages.length === 0}
                className="flex-1 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                title="AI生成追问"
              >
                {iterationProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>生成相应追问</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                💡 基于LLM中介的分析结果提供解决方案
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Ctrl+Enter 快速发送</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default SolutionPanel