var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

function RepoGrid(props) {
	console.log(props);
	return (
		<ul className="popular-list">
			{props.repos.map((repo, index) => {
				return (
					<li key={repo.name} className="popular-item">
						<div className="popular-rank"> #{index + 1}</div>
						<ul className="space-list-items">
							<li>
								<img
									className="avatar"
									src={repo.owner.avatar_url}
									alt={'Avator for ' + repo.owner.login}
								/>
							</li>
							<li>
								<a href={repo.html_url}>{repo.name}</a>
							</li>
							<li>@{repo.owner.login}</li>
							<li> {repo.stargazers_count} stars </li>
						</ul>
					</li>
				);
			})}
		</ul>
	);
}

RepoGrid.propTypes = {
	repos: PropTypes.array.isRequired
};

function SelectLanguage(props) {
	var languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];

	return (
		<ul className="languages">
			{languages.map(lang => {
				return (
					<li
						style={lang === props.selectedLang ? { color: 'red' } : null}
						onClick={props.selectLang.bind(null, lang)}
						key={lang}
					>
						{lang}
					</li>
				);
			})}
		</ul>
	);
}

SelectLanguage.propTypes = {
	selectedLang: PropTypes.string.isRequired,
	selectLang: PropTypes.func.isRequired
};

class Popular extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLang: 'All',
			repos: null
		};
	}
	componentDidMount() {
		this.updateLanguage(this.state.selectedLang);
	}
	updateLanguage(lang) {
		this.setState(() => {
			return {
				selectedLang: lang,
				repos: null
			};
		});

		api.fetchPopularRepos(lang).then(repos => {
			this.setState(() => {
				return {
					repos: repos
				};
			});
		});
	}
	render() {
		return (
			<div>
				<SelectLanguage
					selectedLang={this.state.selectedLang}
					selectLang={this.updateLanguage.bind(this)}
				/>
				{!this.state.repos ? (
					<p> Loading ... </p>
				) : (
					<RepoGrid repos={this.state.repos} />
				)}
			</div>
		);
	}
}

module.exports = Popular;
