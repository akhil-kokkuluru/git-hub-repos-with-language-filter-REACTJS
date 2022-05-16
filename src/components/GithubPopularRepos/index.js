import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import RepositoryItem from '../RepositoryItem'
import LanguageFilterItem from '../LanguageFilterItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repositoriesData: [],
    activeLanguageFilterId: languageFiltersData[0].id,
  }

  componentDidMount() {
    this.getRepositories()
  }

  getRepositories = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      this.setState({apiStatus: apiStatusConstants.success})
      const data = await response.json()
      console.log(data)
      const updatedData = data.popular_repos.map(item => ({
        name: item.name,
        id: item.id,
        issuesCount: item.issues_count,
        forksCount: item.forks_count,
        starsCount: item.stars_count,
        imageUrl: item.avatar_url,
      }))
      console.log(updatedData)
      this.setState({repositoriesData: updatedData})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderRepositoryItemList = () => {
    const {repositoriesData} = this.state
    return (
      <ul>
        {repositoriesData.map(eachItem => (
          <RepositoryItem key={eachItem.id} repositoryDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderRepositories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoryItemList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  setActiveLanguageFilterId = updatedLanguageID => {
    this.setState(
      {activeLanguageFilterId: updatedLanguageID},
      this.getRepositories,
    )
  }

  renderLanguageList = () => {
    const {activeLanguageFilterId} = this.state
    return (
      <ul className="filters-list">
        {languageFiltersData.map(item => (
          <LanguageFilterItem
            key={item.id}
            isActive={activeLanguageFilterId === item.id}
            languageFilterDetails={item}
            setActiveLanguageFilterId={this.setActiveLanguageFilterId}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          {this.renderLanguageList()}
          {this.renderRepositories()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
